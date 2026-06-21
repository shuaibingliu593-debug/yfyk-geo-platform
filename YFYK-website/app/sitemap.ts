import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/home";
import { geoPagePaths } from "@/lib/content/geo-pages";
import { caseStudies } from "@/lib/content/cases";
import { caseLibraryCases, caseLibraryListPages } from "@/lib/content/case-library";
import { faqMeta } from "@/lib/content/faq";
import { newsArticles, newsMeta } from "@/lib/content/news";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.siteUrl}/`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/cases`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.siteUrl}/cases/showcase`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.72,
    },
    ...caseStudies.map((item) => ({
      url: `${siteConfig.siteUrl}${item.href}`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseLibraryListPages
      .filter((item) => item.slug !== "showcase")
      .map((item) => ({
      url: `${siteConfig.siteUrl}/cases/${item.slug}`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...caseLibraryCases.map((item) => ({
      url: `${siteConfig.siteUrl}/cases/${item.slug}`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly" as const,
      priority: item.isFeatured ? 0.74 : 0.68,
    })),
    ...geoPagePaths.map((path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly" as const,
      priority: path.split("/").length <= 2 ? 0.8 : 0.7,
    })),
    {
      url: `${siteConfig.siteUrl}/about/patents`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.78,
    },
    {
      url: `${siteConfig.siteUrl}/geo-native-website`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.siteUrl}/ai-friendly-upgrade`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.siteUrl}/enterprise-knowledge-base`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.siteUrl}${faqMeta.path}`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${siteConfig.siteUrl}${newsMeta.path}`,
      lastModified: siteConfig.dateModified,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    ...newsArticles.map((article) => ({
      url: `${siteConfig.siteUrl}/news/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
