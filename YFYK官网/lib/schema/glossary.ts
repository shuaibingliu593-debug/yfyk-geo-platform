import { siteConfig } from "@/lib/content/home";
import { glossaryMeta, glossaryTerms } from "@/lib/content/glossary";

export function getGlossarySchemas() {
  const url = `${siteConfig.siteUrl}${glossaryMeta.path}`;
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
      name: "GEO 与 AI 搜索术语表",
      description: glossaryMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${url}#defined-term-set` },
      knowsAbout: glossaryTerms.map((term) => term.nameZh),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `${url}#defined-term-set`,
      name: "YFYK GEO 与 AI 搜索术语表",
      description: glossaryMeta.description,
      url,
      hasDefinedTerm: glossaryTerms.map((term) => ({
        "@type": "DefinedTerm",
        "@id": `${url}#${term.id}`,
        name: term.nameZh,
        alternateName: term.nameEn,
        description: term.definition,
        inDefinedTermSet: { "@id": `${url}#defined-term-set` },
      })),
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "术语表", item: url },
      ],
      ...shared,
    },
  ];
}
