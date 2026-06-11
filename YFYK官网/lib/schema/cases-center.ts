import type { CaseCenterItem } from "@/lib/content/cases-center";
import { siteConfig } from "@/lib/content/home";
import { casesCenterMeta } from "@/lib/content/cases-center";

export function getCasesCenterSchemas(items: CaseCenterItem[]) {
  const url = `${siteConfig.siteUrl}${casesCenterMeta.path}`;
  const shared = {
    dateModified: siteConfig.dateModified,
    version: siteConfig.version,
    inLanguage: "zh-CN",
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      name: "案例中心",
      description: casesCenterMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      knowsAbout: [
        "GEO原生建站",
        "网站AI改造",
        "企业知识库",
        "AI可见度",
        "内容结构化",
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#cases`,
      name: "YFYK 项目实践案例",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `${siteConfig.siteUrl}/cases/${item.slug}`,
      })),
    },
  ];
}
