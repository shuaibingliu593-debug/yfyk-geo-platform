import { homeContent, siteConfig } from "@/lib/content/home";
import { ContentTransformer } from "@/lib/markdown/ContentTransformer";

export function getGlobalSchemas() {
  const shared = {
    dateModified: homeContent.metadata.dateModified,
    version: homeContent.metadata.version,
    inLanguage: "zh-CN",
  };
  const organizationId = `${siteConfig.siteUrl}/#organization`;
  const websiteId = `${siteConfig.siteUrl}/#website`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.legalName,
      alternateName: siteConfig.brand,
      url: siteConfig.siteUrl,
      description: homeContent.metadata.summary,
      telephone: siteConfig.hotline,
      email: siteConfig.email,
      knowsAbout: ["AI友好型官网", "GEO", "生成式引擎优化", "企业知识库", "MCP"],
      mentions: ContentTransformer.generateJsonLd(homeContent).mentions,
      contentCredential: siteConfig.contentCredential,
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: `${siteConfig.brand}官网`,
      url: siteConfig.siteUrl,
      description: homeContent.metadata.summary,
      publisher: { "@id": organizationId },
      contentCredential: siteConfig.contentCredential,
      ...shared,
    },
  ];
}

export function getHomePageSchemas() {
  return [{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.siteUrl}/#webpage`,
    name: homeContent.metadata.title,
    description: homeContent.metadata.summary,
    url: siteConfig.siteUrl,
    isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
    about: { "@id": `${siteConfig.siteUrl}/#organization` },
    hasPart: homeContent.sections.map((section) => ({
      "@type": "WebPageElement",
      "@id": `${siteConfig.siteUrl}/#${section.id}`,
      name: section.title,
      abstract: section.summary,
    })),
    dateModified: homeContent.metadata.dateModified,
    version: homeContent.metadata.version,
    inLanguage: "zh-CN",
  }];
}
