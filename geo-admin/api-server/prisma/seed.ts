import {
  ContentStatus,
  GeoTargetType,
  Prisma,
  PrismaClient,
  RelatedServiceType,
  ResourceStatus,
  StaticResourceSourceType,
  StaticResourceType
} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import {
  pathToSlug,
  resolveStaticResourceType,
  staticPageRegistry
} from "../../../shared/static-pages";
import { caseSeedData, type CaseSeedItem } from "./case-seed-data";
import { faqSeedData, type FaqSeedItem } from "./faq-seed-data";

const prisma = new PrismaClient();

const DEPRECATED_STATIC_RESOURCE_KEYS = new Set(["knowledge"]);

const LEGACY_URL_BY_KEY: Record<string, string> = {
  about_company: "/about/company",
  about_contact: "/about/contact"
};

const defaultSettings = [
  { key: "site_name", value: "YFYK", group: "website" },
  { key: "site_url", value: "https://www.yfyk.com", group: "website" },
  { key: "company_name", value: "YFYK", group: "website" },
  { key: "default_language", value: "zh-CN", group: "website" },
  { key: "logo_url", value: "", group: "website" },
  { key: "crawl_weight", value: "30", group: "scoring" },
  { key: "understanding_weight", value: "30", group: "scoring" },
  { key: "structure_weight", value: "40", group: "scoring" }
] as const;

async function main() {
  await seedAdmin();
  await seedSettings();
  const staticResources = await seedStaticResources();
  await deprecateRemovedStaticResources();
  const caseStudies = await seedCases();
  const faqs = await seedFaqs();
  const news = await seedNews();

  await seedScoresAndIssues([
    ...staticResources.map((item) => ({ targetType: GeoTargetType.STATIC_RESOURCE, targetId: item.id })),
    ...caseStudies.map((item) => ({ targetType: GeoTargetType.CASE, targetId: item.id })),
    ...faqs.map((item) => ({ targetType: GeoTargetType.FAQ, targetId: item.id })),
    { targetType: GeoTargetType.NEWS, targetId: news.id }
  ]);
}

async function seedAdmin() {
  const permissions = [
    ["manage", "settings", "修改系统设置"],
    ["manage", "content", "管理案例、FAQ、资讯"],
    ["manage", "geo", "管理 GEO 配置"],
    ["manage", "audit", "管理 GEO 评分"]
  ] as const;

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: { description: "后台管理员" },
    create: { name: "admin", description: "后台管理员" }
  });
  const superAdminRole = await prisma.role.upsert({
    where: { name: "super_admin" },
    update: { description: "超级管理员，可修改系统设置" },
    create: { name: "super_admin", description: "超级管理员，可修改系统设置" }
  });

  for (const [action, resource, description] of permissions) {
    const permission = await prisma.permission.upsert({
      where: { action_resource: { action, resource } },
      update: { description },
      create: { action, resource, description }
    });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permission.id }
    });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: permission.id }
    });
  }

  const user = await prisma.user.upsert({
    where: { email: "admin" },
    update: {
      passwordHash: await bcrypt.hash("admin123456", 10),
      name: "默认管理员"
    },
    create: {
      email: "admin",
      passwordHash: await bcrypt.hash("admin123456", 10),
      name: "默认管理员"
    }
  });

  for (const role of [adminRole, superAdminRole]) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id }
    });
  }
}

async function seedSettings() {
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, group: setting.group },
      create: setting
    });
  }
}

function toStaticResourceType(page: (typeof staticPageRegistry)[number]) {
  const resourceType = resolveStaticResourceType(page);
  return StaticResourceType[resourceType];
}

async function seedStaticResources() {
  const resources = [];

  for (const [index, page] of staticPageRegistry.entries()) {
    const slug = pathToSlug(page.path);
    const resourceType = toStaticResourceType(page);
    const sortOrder = (index + 1) * 10;
    const legacyUrl = LEGACY_URL_BY_KEY[page.key];

    const resource = await prisma.staticResource.upsert({
      where: { resourceKey: page.key },
      update: {
        title: page.title,
        slug,
        resourceType,
        url: page.path,
        sourceType: StaticResourceSourceType.FRONTEND_STATIC,
        status: ResourceStatus.ACTIVE,
        sortOrder
      },
      create: {
        title: page.title,
        slug,
        resourceKey: page.key,
        resourceType,
        url: page.path,
        sourceType: StaticResourceSourceType.FRONTEND_STATIC,
        status: ResourceStatus.ACTIVE,
        sortOrder
      }
    });
    resources.push(resource);

    await upsertStaticPageGeoConfig(resource.id, page, legacyUrl);
  }

  return resources;
}

async function deprecateRemovedStaticResources() {
  for (const resourceKey of DEPRECATED_STATIC_RESOURCE_KEYS) {
    await prisma.staticResource.updateMany({
      where: { resourceKey },
      data: {
        status: ResourceStatus.INACTIVE
      }
    });
  }
}

async function upsertStaticPageGeoConfig(
  resourceId: string,
  page: (typeof staticPageRegistry)[number],
  legacyUrl?: string
) {
  const existing = await prisma.geoConfig.findUnique({
    where: {
      targetType_targetId: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: resourceId
      }
    }
  });

  const defaultData = {
    aiSummary: page.aiSummary,
    metaTitle: `${page.title} - YFYK`,
    metaDescription: page.description,
    canonicalUrl: page.path,
    schemaType: page.schemaType,
    schemaJson: {
      "@context": "https://schema.org",
      "@type": page.schemaType,
      name: page.title,
      url: `https://www.yfyk.com${page.path === "/" ? "" : page.path}`
    },
    llmsEnabled: page.includeInLlms,
    sitemapEnabled: page.includeInAiSitemap,
    sitemapPriority: page.priority
  };

  if (!existing) {
    await prisma.geoConfig.create({
      data: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: resourceId,
        ...defaultData
      }
    });
    return;
  }

  await prisma.geoConfig.update({
    where: {
      targetType_targetId: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: resourceId
      }
    },
    data: {
      canonicalUrl: resolveCanonicalUrl(existing.canonicalUrl, legacyUrl, page.path),
      metaTitle: existing.metaTitle || defaultData.metaTitle,
      schemaType: existing.schemaType || defaultData.schemaType
    }
  });
}

function resolveCanonicalUrl(existing: string | null, legacyUrl: string | undefined, newPath: string) {
  if (!existing) {
    return newPath;
  }

  if (existing === legacyUrl || existing === newPath) {
    return newPath;
  }

  if (existing === "/about/company") {
    return "/about";
  }

  if (existing === "/about/contact") {
    return "/contact";
  }

  return existing;
}

async function upsertCaseSeedItem(item: CaseSeedItem) {
  const data = {
    title: item.title,
    caseType: item.caseType,
    industry: item.industry,
    clientName: item.clientName,
    clientDisplayName: item.clientDisplayName,
    isAnonymized: item.isAnonymized,
    challenge: item.challenge,
    solution: item.solution,
    results: item.results,
    metrics: item.metrics,
    excerpt: item.excerpt,
    content: item.content,
    coverImage: item.coverImage,
    relatedServiceType: item.relatedServiceType,
    status: item.status,
    featured: item.featured,
    sortOrder: item.sortOrder,
    publishedAt: new Date()
  };

  const caseStudy = await prisma.caseStudy.upsert({
    where: { slug: item.slug },
    update: data,
    create: { slug: item.slug, ...data }
  });

  await upsertGeoConfig(GeoTargetType.CASE, caseStudy.id, {
    aiSummary: item.geoSummary,
    metaTitle: `${item.title} - YFYK`,
    metaDescription: item.excerpt,
    canonicalUrl: `/cases/${item.slug}`,
    schemaType: "CreativeWork",
    schemaJson: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: item.title,
      description: item.excerpt,
      image: item.coverImage,
      url: `https://www.yfyk.com/cases/${item.slug}`
    },
    llmsEnabled: true,
    sitemapEnabled: true,
    sitemapPriority: item.featured ? 0.85 : 0.75
  });

  return caseStudy;
}

async function pruneNonSeedCases() {
  const seedSlugs = new Set(caseSeedData.map((item) => item.slug));
  const extras = await prisma.caseStudy.findMany({
    where: { slug: { notIn: [...seedSlugs] } },
    select: { id: true }
  });

  if (extras.length === 0) return;

  await prisma.$transaction(
    extras.flatMap((item) => [
      prisma.geoIssue.deleteMany({ where: { targetType: GeoTargetType.CASE, targetId: item.id } }),
      prisma.geoScore.deleteMany({ where: { targetType: GeoTargetType.CASE, targetId: item.id } }),
      prisma.geoConfig.deleteMany({ where: { targetType: GeoTargetType.CASE, targetId: item.id } }),
      prisma.caseStudy.delete({ where: { id: item.id } })
    ])
  );
  console.log(`Pruned ${extras.length} non-seed cases`);
}

async function seedCases() {
  const seeded = [];
  for (const item of caseSeedData) {
    seeded.push(await upsertCaseSeedItem(item));
  }
  await pruneNonSeedCases();
  console.log(`Seeded ${seeded.length} cases`);
  return seeded;
}

function toRelatedServiceType(value: FaqSeedItem["relatedServiceType"]): RelatedServiceType {
  const map: Record<FaqSeedItem["relatedServiceType"], RelatedServiceType> = {
    GEO_NATIVE_WEBSITE: RelatedServiceType.GEO_NATIVE_WEBSITE,
    AI_FRIENDLY_UPGRADE: RelatedServiceType.AI_FRIENDLY_UPGRADE,
    ENTERPRISE_KNOWLEDGE_BASE: RelatedServiceType.ENTERPRISE_KNOWLEDGE_BASE,
    GENERAL: RelatedServiceType.GENERAL
  };
  return map[value];
}

async function upsertFaqSeedItem(item: FaqSeedItem) {
  const relatedServiceType = toRelatedServiceType(item.relatedServiceType);
  const data = {
    question: item.question,
    answer: item.answer,
    category: item.category,
    relatedServiceType,
    status: ContentStatus.PUBLISHED,
    sortOrder: item.sortOrder
  };

  const existingByQuestion = await prisma.faq.findFirst({
    where: { question: item.question }
  });

  const faq = existingByQuestion
    ? await prisma.faq.update({
        where: { id: existingByQuestion.id },
        data
      })
    : await prisma.faq.upsert({
        where: { id: item.id },
        update: data,
        create: {
          id: item.id,
          ...data
        }
      });

  await upsertGeoConfig(GeoTargetType.FAQ, faq.id, {
    aiSummary: item.answer.replace(/\n+/g, " ").slice(0, 200),
    metaTitle: item.question,
    metaDescription: item.answer.replace(/\n+/g, " ").slice(0, 160),
    canonicalUrl: `/faq#${faq.id}`,
    schemaType: "Question",
    schemaJson: {
      "@context": "https://schema.org",
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    },
    llmsEnabled: true,
    sitemapEnabled: true,
    sitemapPriority: 0.85
  });

  return faq;
}

async function pruneNonSeedFaqs() {
  const seedIds = new Set(faqSeedData.map((item) => item.id));
  const seedQuestions = new Set(faqSeedData.map((item) => item.question));
  const extras = await prisma.faq.findMany({
    where: {
      NOT: {
        OR: [{ id: { in: [...seedIds] } }, { question: { in: [...seedQuestions] } }]
      }
    },
    select: { id: true }
  });

  if (extras.length === 0) return;

  await prisma.$transaction(
    extras.flatMap((item) => [
      prisma.geoIssue.deleteMany({ where: { targetType: GeoTargetType.FAQ, targetId: item.id } }),
      prisma.geoScore.deleteMany({ where: { targetType: GeoTargetType.FAQ, targetId: item.id } }),
      prisma.geoConfig.deleteMany({ where: { targetType: GeoTargetType.FAQ, targetId: item.id } }),
      prisma.faq.delete({ where: { id: item.id } })
    ])
  );
  console.log(`Pruned ${extras.length} non-seed FAQs`);
}

async function seedFaqs() {
  const seeded = [];
  for (const item of faqSeedData) {
    seeded.push(await upsertFaqSeedItem(item));
  }
  await pruneNonSeedFaqs();
  console.log(`Seeded ${seeded.length} FAQs`);
  return seeded;
}

async function seedNews() {
  const item = await prisma.newsArticle.upsert({
    where: { slug: "ai-search-website-content-structure" },
    update: {
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    },
    create: {
      title: "AI搜索时代的官网内容结构升级",
      slug: "ai-search-website-content-structure",
      category: "行业观察",
      source: "YFYK",
      author: "YFYK GEO Team",
      excerpt: "AI 搜索正在改变官网内容的组织方式，企业需要让页面具备更清晰的语义、结构和可引用入口。",
      content: "在 AI 搜索时代，官网不仅要面向用户阅读，也要面向 AI 抓取和理解。企业可以通过清晰的信息架构、结构化数据、AI Summary、llms.txt 与 AI Sitemap 建立更稳定的内容入口。",
      publishDate: new Date(),
      status: ContentStatus.PUBLISHED,
      sortOrder: 10,
      publishedAt: new Date()
    }
  });

  await upsertGeoConfig(GeoTargetType.NEWS, item.id, {
    aiSummary: "这篇资讯介绍 AI 搜索时代官网内容结构升级的方法，包括信息架构、结构化数据、AI Summary、llms.txt 和 AI Sitemap 等关键能力。",
    metaTitle: "AI搜索时代的官网内容结构升级 - YFYK",
    metaDescription: "了解 AI 搜索如何改变官网内容结构，以及企业如何通过 GEO 配置提升 AI 可理解性。",
    canonicalUrl: `/news/${item.slug}`,
    schemaType: "NewsArticle",
    schemaJson: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: item.title,
      description: item.excerpt,
      url: `https://www.yfyk.com/news/${item.slug}`,
      author: item.author,
      datePublished: item.publishDate?.toISOString()
    },
    llmsEnabled: true,
    sitemapEnabled: true,
    sitemapPriority: 0.7
  });

  return item;
}

async function upsertGeoConfig(targetType: GeoTargetType, targetId: string, data: Omit<Prisma.GeoConfigUncheckedCreateInput, "id" | "targetType" | "targetId">) {
  return prisma.geoConfig.upsert({
    where: { targetType_targetId: { targetType, targetId } },
    update: data,
    create: { targetType, targetId, ...data }
  });
}

async function seedScoresAndIssues(targets: Array<{ targetType: GeoTargetType; targetId: string }>) {
  for (const target of targets) {
    const config = await prisma.geoConfig.findUnique({ where: { targetType_targetId: target } });
    if (!config) continue;

    const hasSchema = Boolean(config.schemaJson);
    const crawlScore = Number(config.canonicalUrl ? 5 : 0) + Number(config.llmsEnabled ? 10 : 0) + Number(config.sitemapEnabled ? 10 : 0) + Number(config.sitemapPriority >= 0.1 && config.sitemapPriority <= 1 ? 5 : 0);
    const understandingScore = Number(config.aiSummary ? 15 : 0) + Number(config.aiSummary && config.aiSummary.length >= 50 && config.aiSummary.length <= 300 ? 5 : 0) + Number(config.metaTitle ? 5 : 0) + Number(config.metaDescription ? 5 : 0);
    const structureScore = Number(hasSchema ? 15 : 0) + Number(hasSchema ? 10 : 0) + Number(hasSchema ? 5 : 0) + Number(hasSchema ? 5 : 0) + Number(config.schemaType ? 5 : 0);

    await prisma.geoScore.upsert({
      where: { targetType_targetId: target },
      update: { crawlScore, understandingScore, structureScore, totalScore: crawlScore + understandingScore + structureScore },
      create: { ...target, crawlScore, understandingScore, structureScore, totalScore: crawlScore + understandingScore + structureScore }
    });
  }

  const issueTarget = targets.find((item) => item.targetType === GeoTargetType.STATIC_RESOURCE);
  if (issueTarget) {
    await prisma.geoIssue.deleteMany({
      where: {
        ...issueTarget,
        issueType: "invalid_ai_summary_length",
        description: "演示问题：部分页面 AI Summary 可继续优化为更聚焦的 50-300 字说明。"
      }
    });
    await prisma.geoIssue.create({
      data: {
        ...issueTarget,
        issueType: "invalid_ai_summary_length",
        severity: "low",
        description: "演示问题：部分页面 AI Summary 可继续优化为更聚焦的 50-300 字说明。",
        suggestion: "在静态页面 GEO 配置中优化 AI Summary，并重新评分。",
        status: "open"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
