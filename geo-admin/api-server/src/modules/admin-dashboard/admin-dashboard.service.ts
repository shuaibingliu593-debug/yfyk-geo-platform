import { Injectable } from "@nestjs/common";
import { ContentStatus, GeoScore, GeoTargetType, ResourceStatus } from "@prisma/client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { resolveStorageDir } from "../../common/storage-dir";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../../prisma/prisma.service";

type TargetLabel = {
  title: string;
  url: string | null;
};

@Injectable()
export class AdminDashboardService {
  private readonly llmsStorageDir = resolveStorageDir(process.env.LLMS_STORAGE_DIR, "llms");
  private readonly sitemapStorageDir = resolveStorageDir(process.env.SITEMAP_STORAGE_DIR, "sitemap");

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  async overview() {
    await this.auditService.ensureScores();

    const [
      staticResourceCount,
      caseCount,
      faqCount,
      newsCount,
      publishedCaseCount,
      publishedFaqCount,
      publishedNewsCount,
      activeStaticCount,
      geoConfigsForCoverage,
      highRiskIssueCount,
      lowScoreRows,
      recentContentRows,
      scoreAverage
    ] = await Promise.all([
      this.prisma.staticResource.count(),
      this.prisma.caseStudy.count(),
      this.prisma.faq.count(),
      this.prisma.newsArticle.count(),
      this.prisma.caseStudy.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.faq.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.newsArticle.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.staticResource.count({ where: { status: ResourceStatus.ACTIVE } }),
      this.prisma.geoConfig.findMany({ select: { aiSummary: true, schemaJson: true } }),
      this.prisma.geoIssue.count({ where: { severity: "high", status: "open" } }),
      this.prisma.geoScore.findMany({ orderBy: [{ totalScore: "asc" }, { updatedAt: "desc" }], take: 10 }),
      this.getRecentContentRows(),
      this.prisma.geoScore.aggregate({ _avg: { totalScore: true } })
    ]);

    const [llmsManifest, sitemapManifest] = await Promise.all([this.readManifest(this.llmsStorageDir), this.readManifest(this.sitemapStorageDir)]);
    const [llmsIncludedCount, sitemapIncludedCount] = await Promise.all([this.countIncluded("llms"), this.countIncluded("sitemap")]);
    const labels = await this.resolveTargetLabels(lowScoreRows.map((score) => ({ targetType: score.targetType, targetId: score.targetId })));
    const geoConfigCount = geoConfigsForCoverage.length;
    const aiSummaryCount = geoConfigsForCoverage.filter((config) => Boolean(config.aiSummary?.trim())).length;
    const schemaCount = geoConfigsForCoverage.filter((config) => Boolean(config.schemaJson)).length;

    return {
      metrics: {
        geoTotalScore: Math.round(scoreAverage._avg.totalScore ?? 0),
        staticResourceCount,
        caseCount,
        faqCount,
        newsCount,
        publishedContentCount: activeStaticCount + publishedCaseCount + publishedFaqCount + publishedNewsCount,
        aiSummaryCoverage: this.percentage(aiSummaryCount, geoConfigCount),
        schemaCoverage: this.percentage(schemaCount, geoConfigCount),
        llmsIncludedCount,
        sitemapIncludedCount,
        highRiskIssueCount
      },
      lowScorePages: lowScoreRows.map((score) => ({
        ...score,
        target: labels.get(this.key(score.targetType, score.targetId)) ?? { title: score.targetId, url: null },
        href: this.targetHref(score.targetType)
      })),
      recentUpdates: recentContentRows,
      generation: {
        llmsGeneratedAt: llmsManifest?.generatedAt ?? null,
        sitemapGeneratedAt: sitemapManifest?.generatedAt ?? null
      }
    };
  }

  private async countIncluded(kind: "llms" | "sitemap") {
    const configs = await this.prisma.geoConfig.findMany({
      where: kind === "llms" ? { llmsEnabled: true } : { sitemapEnabled: true }
    });
    const ids = this.groupTargetIds(configs);
    const [staticCount, caseCount, faqCount, newsCount] = await Promise.all([
      this.prisma.staticResource.count({ where: { id: { in: ids.STATIC_RESOURCE }, status: ResourceStatus.ACTIVE } }),
      this.prisma.caseStudy.count({ where: { id: { in: ids.CASE }, status: ContentStatus.PUBLISHED } }),
      this.prisma.faq.count({ where: { id: { in: ids.FAQ }, status: ContentStatus.PUBLISHED } }),
      this.prisma.newsArticle.count({ where: { id: { in: ids.NEWS }, status: ContentStatus.PUBLISHED } })
    ]);

    return staticCount + caseCount + faqCount + newsCount;
  }

  private async getRecentContentRows() {
    const [staticResources, cases, faqs, news] = await Promise.all([
      this.prisma.staticResource.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      this.prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      this.prisma.faq.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      this.prisma.newsArticle.findMany({ orderBy: { updatedAt: "desc" }, take: 6 })
    ]);

    return [
      ...staticResources.map((item) => ({ id: item.id, targetType: GeoTargetType.STATIC_RESOURCE, title: item.title, url: item.url, updatedAt: item.updatedAt, href: "/admin/geo/static-pages" })),
      ...cases.map((item) => ({ id: item.id, targetType: GeoTargetType.CASE, title: item.title, url: `/cases/${item.slug}`, updatedAt: item.updatedAt, href: "/admin/content/cases" })),
      ...faqs.map((item) => ({ id: item.id, targetType: GeoTargetType.FAQ, title: item.question, url: null, updatedAt: item.updatedAt, href: "/admin/content/faqs" })),
      ...news.map((item) => ({ id: item.id, targetType: GeoTargetType.NEWS, title: item.title, url: `/news/${item.slug}`, updatedAt: item.updatedAt, href: "/admin/content/news" }))
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10)
      .map((item) => ({ ...item, updatedAt: item.updatedAt.toISOString() }));
  }

  private groupTargetIds(configs: Array<{ targetType: GeoTargetType; targetId: string }>) {
    return configs.reduce<Record<GeoTargetType, string[]>>(
      (acc, config) => {
        acc[config.targetType].push(config.targetId);
        return acc;
      },
      {
        STATIC_RESOURCE: [],
        CASE: [],
        FAQ: [],
        NEWS: []
      }
    );
  }

  private async resolveTargetLabels(targets: Array<{ targetType: GeoTargetType; targetId: string }>) {
    const labels = new Map<string, TargetLabel>();
    const idsByType = this.groupTargetIds(targets);

    const [staticResources, cases, faqs, news] = await Promise.all([
      this.prisma.staticResource.findMany({ where: { id: { in: idsByType.STATIC_RESOURCE } } }),
      this.prisma.caseStudy.findMany({ where: { id: { in: idsByType.CASE } } }),
      this.prisma.faq.findMany({ where: { id: { in: idsByType.FAQ } } }),
      this.prisma.newsArticle.findMany({ where: { id: { in: idsByType.NEWS } } })
    ]);

    staticResources.forEach((item) => labels.set(this.key(GeoTargetType.STATIC_RESOURCE, item.id), { title: item.title, url: item.url }));
    cases.forEach((item) => labels.set(this.key(GeoTargetType.CASE, item.id), { title: item.title, url: `/cases/${item.slug}` }));
    faqs.forEach((item) => labels.set(this.key(GeoTargetType.FAQ, item.id), { title: item.question, url: null }));
    news.forEach((item) => labels.set(this.key(GeoTargetType.NEWS, item.id), { title: item.title, url: `/news/${item.slug}` }));

    return labels;
  }

  private async readManifest(storageDir: string) {
    try {
      return JSON.parse(await readFile(join(storageDir, "manifest.json"), "utf8")) as { generatedAt?: string };
    } catch {
      return null;
    }
  }

  private percentage(value: number, total: number) {
    return total ? Math.round((value / total) * 100) : 0;
  }

  private targetHref(targetType: GeoScore["targetType"]) {
    if (targetType === GeoTargetType.STATIC_RESOURCE) return "/admin/geo/static-pages";
    if (targetType === GeoTargetType.CASE) return "/admin/content/cases";
    if (targetType === GeoTargetType.FAQ) return "/admin/content/faqs";
    return "/admin/content/news";
  }

  private key(targetType: GeoTargetType, targetId: string) {
    return `${targetType}:${targetId}`;
  }
}
