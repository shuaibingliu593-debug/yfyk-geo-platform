import { siteConfig } from "@/lib/content/home";
import { newsMeta, type NewsArticle } from "@/lib/content/news";

export function getNewsPageSchemas(articles: NewsArticle[]) {
  const url = `${siteConfig.siteUrl}${newsMeta.path}`;
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
      name: "资讯动态",
      description: newsMeta.description,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      about: { "@id": `${siteConfig.siteUrl}/#organization` },
      knowsAbout: [
        "GEO",
        "AI搜索",
        "企业知识库",
        "AI可见度",
        "Schema",
        "MCP",
      ],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#articles`,
      name: "YFYK 资讯动态",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: `${siteConfig.siteUrl}/news/${article.slug}`,
      })),
    },
  ];
}

export function getNewsArticleSchemas(article: NewsArticle) {
  const url = `${siteConfig.siteUrl}/news/${article.slug}`;
  const shared = {
    version: siteConfig.version,
    inLanguage: "zh-CN",
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.excerpt,
      articleSection: article.categoryLabel,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt ?? article.publishedAt,
      author: {
        "@type": "Organization",
        name: siteConfig.legalName,
        url: siteConfig.siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.brand,
        url: siteConfig.siteUrl,
      },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      about: [article.categoryLabel, "GEO", "AI搜索"],
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: article.title,
      description: article.excerpt,
      url,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      dateModified: article.updatedAt ?? article.publishedAt,
      ...shared,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "资讯动态", item: `${siteConfig.siteUrl}/news` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
      ...shared,
    },
  ];
}
