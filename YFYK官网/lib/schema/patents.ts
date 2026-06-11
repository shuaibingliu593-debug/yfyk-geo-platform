import { siteConfig } from "@/lib/content/home";
import {
  patentCredentials,
  patentsMarkdownSections,
  patentsMeta,
  patentsOverviewCards,
} from "@/lib/content/patents";

export function getPatentsSchemas() {
  const url = `${siteConfig.siteUrl}${patentsMeta.path}`;
  const shared = {
    dateModified: siteConfig.dateModified,
    version: siteConfig.version,
    inLanguage: "zh-CN",
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: siteConfig.legalName,
      url: siteConfig.siteUrl,
      knowsAbout: [
        "高新技术企业",
        "软件著作权",
        "知识产权",
        "GEO原生建站",
        "AI友好度升级",
        "企业知识库工程",
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "技术资质与创新能力",
      description: patentsMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      knowsAbout: patentsMeta.description.split("，").slice(0, 4),
      hasPart: patentsMarkdownSections.map((section) => ({
        "@type": "WebPageElement",
        "@id": `${url}#${section.id}`,
        name: section.title,
        abstract: section.summary,
      })),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "关于优服优科", item: `${siteConfig.siteUrl}/about` },
        { "@type": "ListItem", position: 3, name: "专利与高新技术企业", item: url },
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#credentials`,
      name: "证书与知识产权",
      itemListElement: patentCredentials.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
      })),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#capabilities`,
      name: "资质与能力概览",
      itemListElement: patentsOverviewCards.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
      })),
      ...shared,
    },
  ];
}
