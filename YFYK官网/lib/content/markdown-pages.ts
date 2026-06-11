import type { BaseContent, ContentSection } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";
import { getGeoPage } from "@/lib/content/geo-pages";
import { getCaseStudy, getCaseStudyContent } from "@/lib/content/cases";
import { homeContent } from "@/lib/content/home";
import { geoNativeWebsiteMeta, geoNativeMarkdownSections } from "@/lib/content/geo-native-website";
import { aiFriendlyUpgradeMeta, afuMarkdownSections } from "@/lib/content/ai-friendly-upgrade";
import { ekbMeta, ekbMarkdownSections } from "@/lib/content/enterprise-knowledge-base";
import { getCasesCenterPageContent } from "@/lib/content/cases-center";
import { getFaqPageContent } from "@/lib/content/faq";
import { getGlossaryPageContent } from "@/lib/content/glossary";
import { getContactPageContent } from "@/lib/content/contact";
import { getNewsPageContent, getNewsArticleContent, getNewsArticle } from "@/lib/content/news";
import { getPatentsPageContent } from "@/lib/content/patents";

function buildPageContent(
  id: string,
  meta: { title: string; description: string },
  sections: ContentSection[],
): BaseContent {
  return {
    id,
    metadata: {
      title: meta.title,
      summary: meta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections,
  };
}

const marketingPages: Record<string, () => BaseContent> = {
  "/geo-native-website": () =>
    buildPageContent("geo-native-website", geoNativeWebsiteMeta, geoNativeMarkdownSections),
  "/ai-friendly-upgrade": () =>
    buildPageContent("ai-friendly-upgrade", aiFriendlyUpgradeMeta, afuMarkdownSections),
  "/enterprise-knowledge-base": () =>
    buildPageContent("enterprise-knowledge-base", ekbMeta, ekbMarkdownSections),
  "/cases": () => getCasesCenterPageContent(),
  "/faq": () => getFaqPageContent(),
  "/glossary": () => getGlossaryPageContent(),
  "/contact": () => getContactPageContent(),
  "/news": () => getNewsPageContent(),
  "/about/patents": () => getPatentsPageContent(),
};

export function getMarketingPageContent(path: string): BaseContent | undefined {
  return marketingPages[path]?.();
}

export function resolvePageMarkdownContent(path: string): BaseContent | undefined {
  if (path.startsWith("/news/") && path.length > "/news/".length) {
    const article = getNewsArticle(path.slice("/news/".length));
    return article ? getNewsArticleContent(article) : undefined;
  }

  const marketing = getMarketingPageContent(path);
  if (marketing) return marketing;

  const geoPage = getGeoPage(path);
  if (geoPage) return geoPage;

  if (path === "/solutions/cases") {
    return {
      id: "solutions-cases",
      metadata: {
        ...homeContent.metadata,
        title: "项目案例展示 | 优服优科",
        summary:
          "查看优服优科 AI 友好型官网、GEO 原生建站、网站 AI 改造与企业知识信源构建示例项目。",
      },
      sections: homeContent.sections.filter((section) => section.id === "featured-cases"),
    };
  }

  if (path.startsWith("/solutions/cases/")) {
    const caseStudy = getCaseStudy(path.slice("/solutions/cases/".length));
    return caseStudy ? getCaseStudyContent(caseStudy) : undefined;
  }

  return undefined;
}
