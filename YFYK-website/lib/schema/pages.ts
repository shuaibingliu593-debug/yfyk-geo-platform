import type { GeoPageContent } from "@/lib/content/types";
import { getGeoPage, getGeoPageTitle } from "@/lib/content/geo-pages";
import { getVisibleSections } from "@/lib/content/visible-sections";
import { siteConfig } from "@/lib/content/home";

export function getPageSchemas(page: GeoPageContent) {
  const url = `${siteConfig.siteUrl}${page.path}`;
  const shared = { dateModified: page.metadata.dateModified, version: page.metadata.version, inLanguage: "zh-CN" };
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": page.pageType === "AboutPage" || page.pageType === "ContactPage" ? page.pageType : page.templateKind === "aggregate" || page.templateKind === "editorial" ? "CollectionPage" : "WebPage",
      "@id": `${url}#webpage`,
      name: page.hero.title,
      description: page.description,
      url,
      primaryImageOfPage: {
        "@type": "ImageObject",
        contentUrl: `${siteConfig.siteUrl}${page.visualAssets[0].src}`,
        caption: page.visualAssets[0].caption,
      },
      knowsAbout: page.knowsAbout,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      hasPart: getVisibleSections(page).map((section) => ({
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
        ...page.path.split("/").filter(Boolean).map((_, index, parts) => {
          const path = `/${parts.slice(0, index + 1).join("/")}`;
          return { "@type": "ListItem", position: index + 2, name: getGeoPageTitle(path), item: `${siteConfig.siteUrl}${path}` };
        }).filter((item) => getGeoPage(new URL(item.item).pathname)).map((item, index) => ({ ...item, position: index + 2 })),
      ],
      ...shared,
    },
  ];

  if (page.templateKind === "detail") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.hero.title,
      description: page.description,
      url,
      provider: { "@id": `${siteConfig.siteUrl}/#organization` },
      serviceType: page.knowsAbout,
      audience: { "@type": "Audience", audienceType: page.audience },
      ...shared,
    });
  }

  if (page.catalogGroups.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#service-catalog`,
      name: `${page.hero.title}服务目录`,
      itemListElement: page.catalogGroups.flatMap((group) => group.paths).map((path, index) => {
        const item = getGeoPage(path);
        return { "@type": "ListItem", position: index + 1, name: item?.hero.title ?? path, url: `${siteConfig.siteUrl}${path}` };
      }),
      ...shared,
    });
  }

  if (page.faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      ...shared,
    });
  }

  if (page.path === "/glossary" && page.terms.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `${url}#terms`,
      name: "优服优科 GEO 工程与合规术语",
      hasDefinedTerm: page.terms.map((item) => ({ "@type": "DefinedTerm", "@id": `${url}#${item.id}`, name: item.term, description: item.definition })),
      ...shared,
    });
  }

  return schemas;
}
