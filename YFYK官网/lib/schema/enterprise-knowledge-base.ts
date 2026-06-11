import { siteConfig } from "@/lib/content/home";
import {
  ekbCapabilityCards,
  ekbFaqs,
  ekbMarkdownSections,
  ekbMeta,
} from "@/lib/content/enterprise-knowledge-base";

export function getEnterpriseKnowledgeBaseSchemas() {
  const url = `${siteConfig.siteUrl}${ekbMeta.path}`;
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
      name: "企业知识库工程",
      description: ekbMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      knowsAbout: [
        "企业知识库工程",
        "GEO知识中心",
        "FAQ知识体系",
        "企业术语库",
        "AI语义增强",
        "Schema",
        "llms.txt",
      ],
      hasPart: ekbMarkdownSections.map((section) => ({
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
      name: "企业知识库工程",
      description: ekbMeta.description,
      url,
      provider: { "@id": `${siteConfig.siteUrl}/#organization` },
      serviceType: [
        "企业知识库建设",
        "GEO知识中心建设",
        "FAQ知识体系",
        "企业术语库",
        "AI语义增强",
      ],
      areaServed: "CN",
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "企业知识库工程", item: url },
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#capabilities`,
      name: "企业知识库工程能力",
      itemListElement: ekbCapabilityCards.map((item, index) => ({
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
      mainEntity: ekbFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
      ...shared,
    },
  ];
}
