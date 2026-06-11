import { siteConfig } from "@/lib/content/home";
import {
  afuCapabilityCards,
  afuFaqs,
  afuMarkdownSections,
  aiFriendlyUpgradeMeta,
} from "@/lib/content/ai-friendly-upgrade";

export function getAiFriendlyUpgradeSchemas() {
  const url = `${siteConfig.siteUrl}${aiFriendlyUpgradeMeta.path}`;
  const shared = {
    dateModified: siteConfig.dateModified,
    version: siteConfig.version,
    inLanguage: "zh-CN",
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "老网站AI友好度升级",
      description: aiFriendlyUpgradeMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      knowsAbout: [
        "老网站AI友好度升级",
        "GEO审计",
        "内容结构化",
        "权威背书",
        "GEO监测",
        "MCP",
        "llms.txt",
        "AI Sitemap",
      ],
      hasPart: afuMarkdownSections.map((section) => ({
        "@type": "WebPageElement",
        "@id": `${url}#${section.id}`,
        name: section.title,
        abstract: section.summary,
      })),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: "老网站AI友好度升级",
      description: aiFriendlyUpgradeMeta.description,
      url,
      provider: { "@id": `${siteConfig.siteUrl}/#organization` },
      serviceType: ["GEO升级", "AI友好度优化", "网站AI改造"],
      areaServed: "CN",
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "老网站AI友好度升级", item: url },
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#capabilities`,
      name: "老网站AI友好度升级能力",
      itemListElement: afuCapabilityCards.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
      })),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: afuFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
      ...shared,
    },
  ];
}
