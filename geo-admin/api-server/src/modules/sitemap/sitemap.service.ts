import { Injectable, NotFoundException } from "@nestjs/common";
import { CaseStudy, ContentStatus, Faq, GeoConfig, GeoTargetType, NewsArticle, ResourceStatus, StaticResource } from "@prisma/client";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderAiSitemapXml } from "../../shared/ai-sitemap-xml";
import { compareRegistryKeys, getStaticPageByKey, PRESET_STATIC_RESOURCE_KEYS } from "../../shared/static-pages";
import { resolveStorageDir } from "../../common/storage-dir";
import { PrismaService } from "../../prisma/prisma.service";
import { SettingsService } from "../settings/settings.service";

type SitemapItem = {
  geoConfigId: string;
  targetId: string;
  targetType: GeoTargetType;
  title: string;
  url: string;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  defaultPriority: number;
};

type SitemapSnapshot = {
  generatedAt: string;
  totalCount: number;
  items: SitemapItem[];
};

@Injectable()
export class SitemapService {
  private readonly storageDir = resolveStorageDir(process.env.SITEMAP_STORAGE_DIR, "sitemap");

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService
  ) {}

  async getAdminState() {
    const generated = await this.readPublished();

    if (generated) {
      const currentItems = await this.collectItems(await this.settingsService.getSiteUrl());
      return { ...generated, items: currentItems, totalCount: currentItems.length };
    }

    return this.generate({ publish: false });
  }

  async generate(options: { publish: boolean }) {
    const items = await this.collectItems(await this.settingsService.getSiteUrl());
    const snapshot = this.createSnapshot(items);
    const xmlText = this.renderXml(items);
    const result = { ...snapshot, xmlText, published: options.publish };

    if (options.publish) {
      await this.writePublished(result);
    }

    return result;
  }

  async updatePriority(id: string, priority: number) {
    const normalized = Math.min(1, Math.max(0, Number(priority.toFixed(2))));
    const config = await this.prisma.geoConfig.findUnique({ where: { id } });

    if (!config) {
      throw new NotFoundException("GEO config not found");
    }

    await this.prisma.geoConfig.update({
      where: { id },
      data: { sitemapPriority: normalized }
    });

    return this.generate({ publish: false });
  }

  async getPublicXml() {
    const generated = await this.readPublished();

    if (generated) {
      return generated.xmlText;
    }

    const preview = await this.generate({ publish: false });
    return preview.xmlText;
  }

  private async collectItems(siteUrl: string) {
    const configs = await this.prisma.geoConfig.findMany({
      where: { sitemapEnabled: true },
      orderBy: { updatedAt: "desc" }
    });
    const configMap = new Map(configs.map((config) => [this.key(config.targetType, config.targetId), config]));
    const ids = this.groupTargetIds(configs);

    const [staticResources, cases, faqs, news] = await Promise.all([
      this.prisma.staticResource.findMany({
        where: { id: { in: ids.STATIC_RESOURCE }, status: ResourceStatus.ACTIVE },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }),
      this.prisma.caseStudy.findMany({
        where: { id: { in: ids.CASE }, status: ContentStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
      }),
      this.prisma.faq.findMany({
        where: { id: { in: ids.FAQ }, status: ContentStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.prisma.newsArticle.findMany({
        where: { id: { in: ids.NEWS }, status: ContentStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { publishDate: "desc" }, { createdAt: "desc" }]
      })
    ]);

    return [
      ...staticResources
        .filter((item) => PRESET_STATIC_RESOURCE_KEYS.has(item.resourceKey))
        .sort((a, b) => compareRegistryKeys(a.resourceKey, b.resourceKey))
        .map((item) => this.fromStaticResource(item, configMap.get(this.key(GeoTargetType.STATIC_RESOURCE, item.id)), siteUrl)),
      ...cases.map((item) => this.fromCase(item, configMap.get(this.key(GeoTargetType.CASE, item.id)), siteUrl)),
      ...faqs.map((item) => this.fromFaq(item, configMap.get(this.key(GeoTargetType.FAQ, item.id)), siteUrl)),
      ...news.map((item) => this.fromNews(item, configMap.get(this.key(GeoTargetType.NEWS, item.id)), siteUrl))
    ].filter((item): item is SitemapItem => Boolean(item));
  }

  private fromStaticResource(resource: StaticResource, config: GeoConfig | undefined, siteUrl: string): SitemapItem | null {
    if (!config) return null;

    const registryPage = getStaticPageByKey(resource.resourceKey);
    if (!registryPage?.includeInAiSitemap) {
      return null;
    }

    const defaultPriority = registryPage.priority;
    return this.toItem({
      geoConfigId: config.id,
      targetId: resource.id,
      targetType: GeoTargetType.STATIC_RESOURCE,
      title: resource.title,
      url: resource.url,
      updatedAt: resource.updatedAt,
      changefreq: registryPage.changeFrequency,
      priority: this.resolvePriority(config, defaultPriority),
      defaultPriority
    }, siteUrl);
  }

  private fromCase(caseStudy: CaseStudy, config: GeoConfig | undefined, siteUrl: string): SitemapItem | null {
    if (!config) return null;

    return this.toItem({
      geoConfigId: config.id,
      targetId: caseStudy.id,
      targetType: GeoTargetType.CASE,
      title: caseStudy.title,
      url: `/cases/${caseStudy.slug}`,
      updatedAt: caseStudy.updatedAt,
      changefreq: "weekly",
      priority: this.resolvePriority(config, 0.8),
      defaultPriority: 0.8
    }, siteUrl);
  }

  private fromFaq(faq: Faq, config: GeoConfig | undefined, siteUrl: string): SitemapItem | null {
    if (!config) return null;

    return this.toItem({
      geoConfigId: config.id,
      targetId: faq.id,
      targetType: GeoTargetType.FAQ,
      title: faq.question,
      url: `/faq#${faq.id}`,
      updatedAt: faq.updatedAt,
      changefreq: "weekly",
      priority: this.resolvePriority(config, 0.9),
      defaultPriority: 0.9
    }, siteUrl);
  }

  private fromNews(article: NewsArticle, config: GeoConfig | undefined, siteUrl: string): SitemapItem | null {
    if (!config) return null;

    return this.toItem({
      geoConfigId: config.id,
      targetId: article.id,
      targetType: GeoTargetType.NEWS,
      title: article.title,
      url: `/news/${article.slug}`,
      updatedAt: article.updatedAt,
      changefreq: "weekly",
      priority: this.resolvePriority(config, 0.7),
      defaultPriority: 0.7
    }, siteUrl);
  }

  private toItem(input: Omit<SitemapItem, "loc" | "lastmod"> & { updatedAt: Date }, siteUrl: string) {
    return {
      geoConfigId: input.geoConfigId,
      targetId: input.targetId,
      targetType: input.targetType,
      title: input.title,
      url: input.url,
      loc: this.absoluteUrl(input.url, siteUrl),
      lastmod: input.updatedAt.toISOString(),
      changefreq: input.changefreq,
      priority: input.priority,
      defaultPriority: input.defaultPriority
    };
  }

  private renderXml(items: SitemapItem[]) {
    return `${renderAiSitemapXml(
      items.map((item) => ({
        loc: item.loc,
        lastmod: item.lastmod,
        changefreq: item.changefreq,
        priority: item.priority.toFixed(2)
      }))
    )}\n`;
  }

  private createSnapshot(items: SitemapItem[]): SitemapSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      totalCount: items.length,
      items
    };
  }

  private resolvePriority(config: GeoConfig, defaultPriority: number) {
    return config.sitemapPriority === 0.5 && defaultPriority !== 0.5 ? defaultPriority : config.sitemapPriority;
  }

  private groupTargetIds(configs: GeoConfig[]) {
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

  private async writePublished(result: SitemapSnapshot & { xmlText: string }) {
    await mkdir(this.storageDir, { recursive: true });
    await Promise.all([
      writeFile(join(this.storageDir, "ai-sitemap.xml"), result.xmlText, "utf8"),
      writeFile(join(this.storageDir, "manifest.json"), JSON.stringify(result, null, 2), "utf8")
    ]);
  }

  private async readPublished() {
    try {
      const [xmlText, manifestText] = await Promise.all([readFile(join(this.storageDir, "ai-sitemap.xml"), "utf8"), readFile(join(this.storageDir, "manifest.json"), "utf8")]);
      const manifest = JSON.parse(manifestText) as SitemapSnapshot;
      return { ...manifest, xmlText, published: true };
    } catch {
      return null;
    }
  }

  private absoluteUrl(url: string, siteUrl: string) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
  }

  private key(targetType: GeoTargetType, targetId: string) {
    return `${targetType}:${targetId}`;
  }
}
