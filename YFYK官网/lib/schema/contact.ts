import { siteConfig } from "@/lib/content/home";
import { contactMeta } from "@/lib/content/contact";

export function getContactPageSchemas() {
  const url = `${siteConfig.siteUrl}${contactMeta.path}`;
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
      name: "联系我们",
      description: contactMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${url}#contactpage` },
      knowsAbout: [
        "GEO",
        "AI搜索",
        "企业知识库",
        "官网建设",
        "网站诊断",
        "MCP",
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${url}#contactpage`,
      name: "YFYK 联系我们",
      description: contactMeta.description,
      url,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: { "@id": `${siteConfig.siteUrl}/#organization` },
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: siteConfig.brand,
      legalName: siteConfig.legalName,
      url: siteConfig.siteUrl,
      email: siteConfig.email,
      telephone: siteConfig.hotline,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "business@yfyk.com",
          availableLanguage: ["Chinese"],
        },
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@yfyk.com",
          availableLanguage: ["Chinese"],
        },
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "联系我们", item: url },
      ],
      ...shared,
    },
  ];
}
