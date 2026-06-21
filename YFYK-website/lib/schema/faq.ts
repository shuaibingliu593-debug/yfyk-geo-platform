import { siteConfig } from "@/lib/content/home";
import { faqMeta, type FaqItem } from "@/lib/content/faq";

export function getFaqPageSchemas(items: FaqItem[]) {
  const url = `${siteConfig.siteUrl}${faqMeta.path}`;
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
      name: "FAQ中心",
      description: faqMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${url}#faqpage` },
      knowsAbout: [
        "GEO",
        "AI搜索",
        "企业知识库",
        "官网建设",
        "MCP",
        "FAQ",
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faqpage`,
      name: "YFYK FAQ中心",
      description: faqMeta.description,
      url,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: items.map((item) => ({
        "@type": "Question",
        "@id": `${url}#${item.id}`,
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "FAQ中心", item: url },
      ],
      ...shared,
    },
  ];
}
