import { Injectable, NotFoundException } from "@nestjs/common";
import { GeoConfig, GeoScore, GeoTargetType, Prisma, ResourceStatus } from "@prisma/client";
import { getStaticPageByKey, PRESET_STATIC_RESOURCE_KEYS } from "../../shared/static-pages";
import { PrismaService } from "../../prisma/prisma.service";
import { SettingsService } from "../settings/settings.service";

type ScoreBand = "all" | "excellent" | "good" | "warning" | "poor";
type IssueSeverity = "high" | "medium" | "low";
type AuditIssueDraft = {
  issueType: string;
  severity: IssueSeverity;
  description: string;
  suggestion: string;
};

type TargetLabel = {
  title: string;
  url: string | null;
};

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService
  ) {}

  async listScores(filters: { targetType?: string; scoreBand?: ScoreBand }) {
    await this.ensureScores();
    const targetType = this.toGeoTargetType(filters.targetType);
    const scores = await this.prisma.geoScore.findMany({
      where: {
        ...(targetType ? { targetType } : {}),
        ...this.scoreBandWhere(filters.scoreBand)
      },
      orderBy: [{ totalScore: "asc" }, { updatedAt: "desc" }]
    });
    const labels = await this.resolveTargetLabels(scores.map((score) => ({ targetType: score.targetType, targetId: score.targetId })));
    const openIssueCounts = await this.getOpenIssueCounts(scores);

    return scores.map((score) => ({
      ...score,
      target: labels.get(this.key(score.targetType, score.targetId)) ?? { title: score.targetId, url: null },
      openIssueCount: openIssueCounts.get(this.key(score.targetType, score.targetId)) ?? 0
    }));
  }

  async listIssues(filters: { targetType?: string; severity?: string; status?: string }) {
    await this.ensureScores();
    const targetType = this.toGeoTargetType(filters.targetType);
    const issues = await this.prisma.geoIssue.findMany({
      where: {
        ...(targetType ? { targetType } : {}),
        ...(filters.severity && filters.severity !== "all" ? { severity: filters.severity } : {}),
        ...(filters.status && filters.status !== "all" ? { status: filters.status } : {})
      },
      orderBy: [{ status: "asc" }, { severity: "asc" }, { updatedAt: "desc" }]
    });
    const labels = await this.resolveTargetLabels(issues.map((issue) => ({ targetType: issue.targetType, targetId: issue.targetId })));

    return issues.map((issue) => ({
      ...issue,
      target: labels.get(this.key(issue.targetType, issue.targetId)) ?? { title: issue.targetId, url: null }
    }));
  }

  async rescoreOne(targetTypeValue: string, targetId: string) {
    const targetType = this.toGeoTargetType(targetTypeValue);

    if (!targetType) {
      throw new NotFoundException("Unsupported target type");
    }

    let config = await this.prisma.geoConfig.findUnique({ where: { targetType_targetId: { targetType, targetId } } });

    if (!config) {
      config = await this.ensureGeoConfigForTarget(targetType, targetId);
    }

    if (!config) {
      await this.deleteScoreArtifacts(targetType, targetId);
      throw new NotFoundException("评分对象不存在或已被删除");
    }

    if (!(await this.isEligibleForScoring(config))) {
      await this.deleteScoreArtifacts(targetType, targetId);
      throw new NotFoundException("评分对象不在静态页面注册表范围内或已下线");
    }

    return this.scoreConfig(config);
  }

  async rescoreAll() {
    const configs = await this.prisma.geoConfig.findMany({ orderBy: { updatedAt: "desc" } });
    const results = [];

    for (const config of configs) {
      if (!(await this.isEligibleForScoring(config))) {
        continue;
      }
      results.push(await this.scoreConfig(config));
    }

    return {
      count: results.length,
      scores: results.map((result) => result.score)
    };
  }

  async resolveIssue(id: string) {
    const issue = await this.prisma.geoIssue.findUnique({ where: { id } });

    if (!issue) {
      throw new NotFoundException("GEO issue not found");
    }

    return this.prisma.geoIssue.update({
      where: { id },
      data: { status: "resolved" }
    });
  }

  async ensureScores() {
    await this.cleanupOrphanedScores();

    const [configs, scores] = await Promise.all([this.prisma.geoConfig.findMany(), this.prisma.geoScore.findMany()]);
    const scoredKeys = new Set(scores.map((score) => this.key(score.targetType, score.targetId)));
    const missingConfigs = [];

    for (const config of configs) {
      if (scoredKeys.has(this.key(config.targetType, config.targetId))) {
        continue;
      }
      if (await this.isEligibleForScoring(config)) {
        missingConfigs.push(config);
      }
    }

    if (missingConfigs.length === 0) {
      return;
    }

    for (const config of missingConfigs) {
      await this.scoreConfig(config);
    }
  }

  private async cleanupOrphanedScores() {
    const scores = await this.prisma.geoScore.findMany();
    const configKeys = new Set(
      (await this.prisma.geoConfig.findMany({ select: { targetType: true, targetId: true } })).map((config) =>
        this.key(config.targetType, config.targetId)
      )
    );

    for (const score of scores) {
      const scoreKey = this.key(score.targetType, score.targetId);
      const config = await this.prisma.geoConfig.findUnique({
        where: { targetType_targetId: { targetType: score.targetType, targetId: score.targetId } }
      });

      if (config && !(await this.isEligibleForScoring(config))) {
        await this.deleteScoreArtifacts(score.targetType, score.targetId);
        continue;
      }

      if (configKeys.has(scoreKey)) {
        continue;
      }

      const targetExists = await this.targetEntityExists(score.targetType, score.targetId);
      if (!targetExists) {
        await this.deleteScoreArtifacts(score.targetType, score.targetId);
      }
    }
  }

  private async isEligibleForScoring(config: GeoConfig) {
    if (config.targetType !== GeoTargetType.STATIC_RESOURCE) {
      return true;
    }

    const resource = await this.prisma.staticResource.findUnique({ where: { id: config.targetId } });
    if (!resource || resource.status !== ResourceStatus.ACTIVE) {
      return false;
    }

    if (!PRESET_STATIC_RESOURCE_KEYS.has(resource.resourceKey)) {
      return false;
    }

    const registryPage = getStaticPageByKey(resource.resourceKey);
    return Boolean(registryPage?.includeInGeoScore);
  }

  private async ensureGeoConfigForTarget(targetType: GeoTargetType, targetId: string) {
    switch (targetType) {
      case GeoTargetType.STATIC_RESOURCE: {
        const resource = await this.prisma.staticResource.findUnique({ where: { id: targetId } });
        if (!resource) return null;

        return this.prisma.geoConfig.upsert({
          where: { targetType_targetId: { targetType, targetId } },
          update: {
            metaTitle: resource.title,
            canonicalUrl: resource.url
          },
          create: {
            targetType,
            targetId,
            metaTitle: resource.title,
            canonicalUrl: resource.url
          }
        });
      }
      case GeoTargetType.CASE: {
        const caseStudy = await this.prisma.caseStudy.findUnique({ where: { id: targetId } });
        if (!caseStudy) return null;

        return this.prisma.geoConfig.upsert({
          where: { targetType_targetId: { targetType, targetId } },
          update: {
            aiSummary: caseStudy.excerpt,
            metaTitle: caseStudy.title,
            metaDescription: caseStudy.excerpt,
            canonicalUrl: `/cases/${caseStudy.slug}`
          },
          create: {
            targetType,
            targetId,
            aiSummary: caseStudy.excerpt,
            metaTitle: caseStudy.title,
            metaDescription: caseStudy.excerpt,
            canonicalUrl: `/cases/${caseStudy.slug}`,
            schemaType: "CreativeWork"
          }
        });
      }
      case GeoTargetType.FAQ: {
        const faq = await this.prisma.faq.findUnique({ where: { id: targetId } });
        if (!faq) return null;

        return this.prisma.geoConfig.upsert({
          where: { targetType_targetId: { targetType, targetId } },
          update: {
            aiSummary: faq.answer,
            metaTitle: faq.question,
            metaDescription: faq.answer.slice(0, 160)
          },
          create: {
            targetType,
            targetId,
            aiSummary: faq.answer,
            metaTitle: faq.question,
            metaDescription: faq.answer.slice(0, 160),
            schemaType: "FAQPage"
          }
        });
      }
      case GeoTargetType.NEWS: {
        const article = await this.prisma.newsArticle.findUnique({ where: { id: targetId } });
        if (!article) return null;

        return this.prisma.geoConfig.upsert({
          where: { targetType_targetId: { targetType, targetId } },
          update: {
            aiSummary: article.excerpt,
            metaTitle: article.title,
            metaDescription: article.excerpt,
            canonicalUrl: `/news/${article.slug}`
          },
          create: {
            targetType,
            targetId,
            aiSummary: article.excerpt,
            metaTitle: article.title,
            metaDescription: article.excerpt,
            canonicalUrl: `/news/${article.slug}`,
            schemaType: "NewsArticle"
          }
        });
      }
      default:
        return null;
    }
  }

  private async targetEntityExists(targetType: GeoTargetType, targetId: string) {
    switch (targetType) {
      case GeoTargetType.STATIC_RESOURCE:
        return Boolean(await this.prisma.staticResource.findUnique({ where: { id: targetId }, select: { id: true } }));
      case GeoTargetType.CASE:
        return Boolean(await this.prisma.caseStudy.findUnique({ where: { id: targetId }, select: { id: true } }));
      case GeoTargetType.FAQ:
        return Boolean(await this.prisma.faq.findUnique({ where: { id: targetId }, select: { id: true } }));
      case GeoTargetType.NEWS:
        return Boolean(await this.prisma.newsArticle.findUnique({ where: { id: targetId }, select: { id: true } }));
      default:
        return false;
    }
  }

  private async deleteScoreArtifacts(targetType: GeoTargetType, targetId: string) {
    await this.prisma.$transaction([
      this.prisma.geoIssue.deleteMany({ where: { targetType, targetId } }),
      this.prisma.geoScore.deleteMany({ where: { targetType, targetId } })
    ]);
  }

  private async scoreConfig(config: GeoConfig) {
    const result = this.calculate(config, await this.settingsService.getScoringWeightsFromSettings());

    const score = await this.prisma.geoScore.upsert({
      where: { targetType_targetId: { targetType: config.targetType, targetId: config.targetId } },
      update: {
        crawlScore: result.crawlScore,
        understandingScore: result.understandingScore,
        structureScore: result.structureScore,
        totalScore: result.totalScore
      },
      create: {
        targetType: config.targetType,
        targetId: config.targetId,
        crawlScore: result.crawlScore,
        understandingScore: result.understandingScore,
        structureScore: result.structureScore,
        totalScore: result.totalScore
      }
    });

    await this.prisma.geoIssue.updateMany({
      where: { targetType: config.targetType, targetId: config.targetId, status: "open" },
      data: { status: "resolved" }
    });

    if (result.issues.length > 0) {
      await this.prisma.geoIssue.createMany({
        data: result.issues.map((issue) => ({
          targetType: config.targetType,
          targetId: config.targetId,
          issueType: issue.issueType,
          severity: issue.severity,
          description: issue.description,
          suggestion: issue.suggestion,
          status: "open"
        }))
      });
    }

    return { score, issues: result.issues };
  }

  private calculate(config: GeoConfig, weights: { crawlWeight: number; understandingWeight: number; structureWeight: number }) {
    const issues: AuditIssueDraft[] = [];

    let crawlRawScore = 0;
    if (config.canonicalUrl) {
      crawlRawScore += 5;
    } else {
      issues.push({
        issueType: "missing_canonical",
        severity: "medium",
        description: "Canonical URL 未配置，AI 抓取时缺少标准页面地址。",
        suggestion: "在 GEO 配置中补充 canonical_url。"
      });
    }

    if (config.llmsEnabled) {
      crawlRawScore += 10;
    } else {
      issues.push({
        issueType: "missing_llms",
        severity: "medium",
        description: "对象未进入 llms.txt 收录范围。",
        suggestion: "开启 llms_enabled，并重新生成 llms.txt。"
      });
    }

    if (config.sitemapEnabled) {
      crawlRawScore += 10;
    } else {
      issues.push({
        issueType: "missing_sitemap",
        severity: "medium",
        description: "对象未进入 AI Sitemap 收录范围。",
        suggestion: "开启 sitemap_enabled，并重新生成 AI Sitemap。"
      });
    }

    if (this.isReasonablePriority(config.sitemapPriority)) {
      crawlRawScore += 5;
    } else {
      issues.push({
        issueType: "invalid_sitemap_priority",
        severity: "low",
        description: "Sitemap 优先级不合理。",
        suggestion: "将 sitemap_priority 设置在 0.1 到 1.0 之间。"
      });
    }

    let understandingRawScore = 0;
    const summary = config.aiSummary?.trim() ?? "";
    if (summary) {
      understandingRawScore += 15;
      if (summary.length >= 50 && summary.length <= 300) {
        understandingRawScore += 5;
      } else {
        issues.push({
          issueType: "invalid_ai_summary_length",
          severity: "low",
          description: "AI Summary 长度不在 50-300 字范围。",
          suggestion: "将 AI Summary 调整为 50-300 字，覆盖对象定位、价值和上下文。"
        });
      }
    } else {
      issues.push({
        issueType: "missing_ai_summary",
        severity: "high",
        description: "AI Summary 缺失，AI 很难快速理解该对象。",
        suggestion: "补充 50-300 字 AI Summary。"
      });
    }

    if (config.metaTitle) {
      understandingRawScore += 5;
    } else {
      issues.push({
        issueType: "missing_meta_title",
        severity: "medium",
        description: "Meta Title 缺失。",
        suggestion: "补充能准确描述对象主题的 meta_title。"
      });
    }

    if (config.metaDescription) {
      understandingRawScore += 5;
    } else {
      issues.push({
        issueType: "missing_meta_description",
        severity: "medium",
        description: "Meta Description 缺失。",
        suggestion: "补充简洁的 meta_description。"
      });
    }

    let structureRawScore = 0;
    if (config.schemaJson) {
      structureRawScore += 15;
      if (this.isValidSchema(config.schemaJson)) {
        structureRawScore += 10;
      } else {
        issues.push({
          issueType: "invalid_schema",
          severity: "high",
          description: "Schema JSON 不是合法 JSON-LD 对象。",
          suggestion: "使用 Schema 配置模块修复 schema_json。"
        });
      }

      if (this.hasJsonLdKey(config.schemaJson, "@context")) {
        structureRawScore += 5;
      } else {
        issues.push({
          issueType: "invalid_schema",
          severity: "medium",
          description: "Schema JSON 缺少 @context。",
          suggestion: "为 schema_json 增加 @context，例如 https://schema.org。"
        });
      }

      if (this.hasJsonLdKey(config.schemaJson, "@type")) {
        structureRawScore += 5;
      } else {
        issues.push({
          issueType: "invalid_schema",
          severity: "medium",
          description: "Schema JSON 缺少 @type。",
          suggestion: "为 schema_json 增加符合对象类型的 @type。"
        });
      }

      if (this.schemaTypeMatches(config)) {
        structureRawScore += 5;
      } else {
        issues.push({
          issueType: "invalid_schema",
          severity: "low",
          description: "schema_type 与对象类型不够匹配。",
          suggestion: "按对象类型选择推荐 Schema 类型。"
        });
      }
    } else {
      issues.push({
        issueType: "missing_schema",
        severity: "high",
        description: "Schema JSON 缺失，结构化程度不足。",
        suggestion: "在 Schema 配置中补充 schema_json。"
      });
    }

    const crawlScore = Math.round((crawlRawScore / 30) * weights.crawlWeight);
    const understandingScore = Math.round((understandingRawScore / 30) * weights.understandingWeight);
    const structureScore = Math.round((structureRawScore / 40) * weights.structureWeight);

    return {
      crawlScore,
      understandingScore,
      structureScore,
      totalScore: crawlScore + understandingScore + structureScore,
      issues
    };
  }

  private isReasonablePriority(priority: number) {
    return priority >= 0.1 && priority <= 1;
  }

  private isValidSchema(value: Prisma.JsonValue | null) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  private hasJsonLdKey(value: Prisma.JsonValue | null, key: "@context" | "@type") {
    return Boolean(value && typeof value === "object" && !Array.isArray(value) && key in value);
  }

  private schemaTypeMatches(config: GeoConfig) {
    const schemaType = config.schemaType ?? this.getJsonType(config.schemaJson);
    if (!schemaType) return false;

    const allowed: Record<GeoTargetType, string[]> = {
      STATIC_RESOURCE: ["Organization", "WebPage", "Service", "DefinedTerm", "CreativeWork", "Product", "LocalBusiness", "CollectionPage", "DefinedTermSet", "ContactPage"],
      CASE: ["CreativeWork", "Article"],
      FAQ: ["FAQPage"],
      NEWS: ["NewsArticle", "Article"]
    };

    return allowed[config.targetType].includes(schemaType);
  }

  private getJsonType(value: Prisma.JsonValue | null) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const type = value["@type" as keyof typeof value];
    return typeof type === "string" ? type : null;
  }

  private scoreBandWhere(scoreBand?: ScoreBand): Prisma.GeoScoreWhereInput {
    if (!scoreBand || scoreBand === "all") return {};
    if (scoreBand === "excellent") return { totalScore: { gte: 90 } };
    if (scoreBand === "good") return { totalScore: { gte: 75, lt: 90 } };
    if (scoreBand === "warning") return { totalScore: { gte: 60, lt: 75 } };
    return { totalScore: { lt: 60 } };
  }

  private async getOpenIssueCounts(scores: GeoScore[]) {
    const counts = new Map<string, number>();
    if (scores.length === 0) {
      return counts;
    }

    const issues = await this.prisma.geoIssue.groupBy({
      by: ["targetType", "targetId"],
      where: {
        status: "open",
        OR: scores.map((score) => ({ targetType: score.targetType, targetId: score.targetId }))
      },
      _count: { id: true }
    });

    issues.forEach((issue) => counts.set(this.key(issue.targetType, issue.targetId), issue._count.id));
    return counts;
  }

  private async resolveTargetLabels(targets: Array<{ targetType: GeoTargetType; targetId: string }>) {
    const labels = new Map<string, TargetLabel>();
    const idsByType = targets.reduce<Record<GeoTargetType, string[]>>(
      (acc, target) => {
        if (!acc[target.targetType].includes(target.targetId)) acc[target.targetType].push(target.targetId);
        return acc;
      },
      {
        STATIC_RESOURCE: [],
        CASE: [],
        FAQ: [],
        NEWS: []
      }
    );

    const [staticResources, cases, faqs, news] = await Promise.all([
      this.prisma.staticResource.findMany({ where: { id: { in: idsByType.STATIC_RESOURCE } } }),
      this.prisma.caseStudy.findMany({ where: { id: { in: idsByType.CASE } } }),
      this.prisma.faq.findMany({ where: { id: { in: idsByType.FAQ } } }),
      this.prisma.newsArticle.findMany({ where: { id: { in: idsByType.NEWS } } })
    ]);

    staticResources.forEach((item) => labels.set(this.key(GeoTargetType.STATIC_RESOURCE, item.id), { title: item.title, url: item.url }));
    cases.forEach((item) => labels.set(this.key(GeoTargetType.CASE, item.id), { title: item.title, url: `/cases/${item.slug}` }));
    faqs.forEach((item) => labels.set(this.key(GeoTargetType.FAQ, item.id), { title: item.question, url: null }));
    news.forEach((item) => labels.set(this.key(GeoTargetType.NEWS, item.id), { title: item.title, url: `/news/${item.slug}` }));

    return labels;
  }

  private toGeoTargetType(value?: string): GeoTargetType | undefined {
    if (!value || value === "all") return undefined;
    const normalized = value.toUpperCase();
    if (normalized === "STATIC_RESOURCE" || normalized === "CASE" || normalized === "FAQ" || normalized === "NEWS") {
      return normalized as GeoTargetType;
    }
    return undefined;
  }

  private key(targetType: GeoTargetType, targetId: string) {
    return `${targetType}:${targetId}`;
  }
}
