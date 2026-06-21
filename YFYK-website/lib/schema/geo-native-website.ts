import { siteConfig } from "@/lib/content/home";
import {
  geoNativeFaqs,
  geoNativeWebsiteMeta,
  geoNativeMarkdownSections,
  geoNativeThemeCards,
} from "@/lib/content/geo-native-website";

export function getGeoNativeWebsiteSchemas() {
  const url = `${siteConfig.siteUrl}${geoNativeWebsiteMeta.path}`;
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
      name: "GEO原生建站",
      description: geoNativeWebsiteMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      knowsAbout: ["GEO原生建站", "AI企业官网", "AI品牌官网", "AI外贸独立站", "llms.txt", "Schema"],
      hasPart: geoNativeMarkdownSections.map((section) => ({
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
        { "@type": "ListItem", position: 2, name: "GEO原生建站", item: url },
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#service-themes`,
      name: "GEO原生建站业务类型",
      itemListElement: geoNativeThemeCards.map((item, index) => ({
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
      mainEntity: geoNativeFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
      ...shared,
    },
  ];
}
