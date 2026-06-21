import { NextResponse } from "next/server";
import { renderAiSitemapXml } from "@/lib/geo/ai-sitemap-xml";
import { getRegistryPagesForAiSitemap } from "@/lib/geo/static-pages-registry";
import { siteConfig } from "@/lib/content/home";
import { casesCenterMeta } from "@/lib/content/cases-center";
import { faqMeta } from "@/lib/content/faq";
import { newsMeta } from "@/lib/content/news";

const dynamicAiSitemapEntries = [
  { path: casesCenterMeta.path, priority: 0.88, changeFrequency: "weekly" as const },
  { path: faqMeta.path, priority: 0.86, changeFrequency: "weekly" as const },
  { path: newsMeta.path, priority: 0.84, changeFrequency: "weekly" as const }
];

function absoluteUrl(path: string) {
  return `${siteConfig.siteUrl}${path === "/" ? "" : path}`;
}

export async function GET() {
  const staticEntries = getRegistryPagesForAiSitemap().map((page) => ({
    loc: absoluteUrl(page.path),
    lastmod: siteConfig.dateModified,
    changefreq: page.changeFrequency,
    priority: page.priority.toFixed(2)
  }));

  const dynamicEntries = dynamicAiSitemapEntries.map((entry) => ({
    loc: absoluteUrl(entry.path),
    lastmod: siteConfig.dateModified,
    changefreq: entry.changeFrequency,
    priority: entry.priority.toFixed(2)
  }));

  const body = renderAiSitemapXml([...staticEntries, ...dynamicEntries]);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600"
    }
  });
}
