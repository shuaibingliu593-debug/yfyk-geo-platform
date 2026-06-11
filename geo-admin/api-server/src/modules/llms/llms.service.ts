import { Injectable } from "@nestjs/common";
import { CaseStudy, ContentStatus, Faq, GeoConfig, GeoTargetType, NewsArticle, ResourceStatus, StaticResource } from "@prisma/client";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { compareRegistryKeys, getStaticPageByKey, PRESET_STATIC_RESOURCE_KEYS } from "../../shared/static-pages";
import { resolveStorageDir } from "../../common/storage-dir";
import { PrismaService } from "../../prisma/prisma.service";
import { SettingsService } from "../settings/settings.service";

type LlmsSection = "site" | "cases" | "faqs" | "news";

type LlmsItem = {
  id: string;
  targetType: GeoTargetType;
  title: string;
  url: string | null;
  section: LlmsSection;
  summary: string | null;
  description: string | null;
  body: string | null;
  sortOrder: number;
};

type LlmsSnapshot = {
  generatedAt: string;
  totalCount: number;
  counts: Record<LlmsSection, number>;
  items: Array<Pick<LlmsItem, "id" | "targetType" | "title" | "url" | "section">>;
};

@Injectable()
export class LlmsService {
  private readonly storageDir = resolveStorageDir(process.env.LLMS_STORAGE_DIR, "llms");

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService
  ) {}

  async getAdminState() {
    const generated = await this.readPublished();

    if (generated) {
      return generated;
    }

    return this.generate({ publish: false });
  }

  async generate(options: { publish: boolean }) {
    const items = await this.collectItems();
    const snapshot = this.createSnapshot(items);
    const siteUrl = await this.settingsService.getSiteUrl();
    const llmsText = this.renderLlmsText(items, siteUrl);
    const llmsFullText = this.renderLlmsFullText(items, snapshot.generatedAt, siteUrl);
    const result = { ...snapshot, llmsText, llmsFullText, published: options.publish };

    if (options.publish) {
      await this.writePublished(result);
    }

    return result;
  }

  async getPublicText(kind: "llms" | "llms-full") {
    const generated = await this.readPublished();

    if (generated) {
      return kind === "llms" ? generated.llmsText : generated.llmsFullText;
    }

    const preview = await this.generate({ publish: false });
    return kind === "llms" ? preview.llmsText : preview.llmsFullText;
  }

  private async collectItems() {
    const configs = await this.prisma.geoConfig.findMany({
      where: { llmsEnabled: true },
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

    const staticItems = staticResources
      .filter((item) => PRESET_STATIC_RESOURCE_KEYS.has(item.resourceKey))
      .sort((a, b) => compareRegistryKeys(a.resourceKey, b.resourceKey))
      .map((item) => this.fromStaticResource(item, configMap.get(this.key(GeoTargetType.STATIC_RESOURCE, item.id))))
      .filter((item): item is LlmsItem => Boolean(item));

    return [
      ...staticItems,
      ...cases.map((item) => this.fromCase(item, configMap.get(this.key(GeoTargetType.CASE, item.id)))),
      ...faqs.map((item) => this.fromFaq(item, configMap.get(this.key(GeoTargetType.FAQ, item.id)))),
      ...news.map((item) => this.fromNews(item, configMap.get(this.key(GeoTargetType.NEWS, item.id))))
    ].filter((item): item is LlmsItem => Boolean(item));
  }

  private fromStaticResource(resource: StaticResource, config?: GeoConfig): LlmsItem | null {
    if (!config) return null;

    const registryPage = getStaticPageByKey(resource.resourceKey);
    if (!registryPage?.includeInLlms) {
      return null;
    }

    return {
      id: resource.id,
      targetType: GeoTargetType.STATIC_RESOURCE,
      title: resource.title,
      url: resource.url,
      section: "site",
      summary: config.aiSummary,
      description: config.metaDescription,
      body: null,
      sortOrder: resource.sortOrder
    };
  }

  private fromCase(caseStudy: CaseStudy, config?: GeoConfig): LlmsItem | null {
    if (!config) return null;

    return {
      id: caseStudy.id,
      targetType: GeoTargetType.CASE,
      title: caseStudy.title,
      url: `/cases/${caseStudy.slug}`,
      section: "cases",
      summary: config.aiSummary,
      description: config.metaDescription ?? caseStudy.excerpt,
      body: [caseStudy.challenge, caseStudy.solution, caseStudy.results].filter(Boolean).join("\n"),
      sortOrder: caseStudy.sortOrder
    };
  }

  private fromFaq(faq: Faq, config?: GeoConfig): LlmsItem | null {
    if (!config) return null;

    return {
      id: faq.id,
      targetType: GeoTargetType.FAQ,
      title: faq.question,
      url: null,
      section: "faqs",
      summary: config.aiSummary,
      description: config.metaDescription ?? faq.answer,
      body: faq.answer,
      sortOrder: faq.sortOrder
    };
  }

  private fromNews(article: NewsArticle, config?: GeoConfig): LlmsItem | null {
    if (!config) return null;

    return {
      id: article.id,
      targetType: GeoTargetType.NEWS,
      title: article.title,
      url: `/news/${article.slug}`,
      section: "news",
      summary: config.aiSummary,
      description: config.metaDescription ?? article.excerpt,
      body: article.content,
      sortOrder: article.sortOrder
    };
  }

  private renderLlmsText(items: LlmsItem[], siteUrl: string) {
    const sections = this.bySection(items);
    const lines = ["YFYK", "", "Site"];

    sections.site.forEach((item) => lines.push(`${item.title}: ${this.absoluteUrl(item.url, siteUrl)}`));
    lines.push("", "Cases");
    sections.cases.forEach((item) => lines.push(`${item.title}: ${this.absoluteUrl(item.url, siteUrl)}`));
    lines.push("", "FAQs");
    sections.faqs.forEach((item) => lines.push(item.title));
    lines.push("", "News");
    sections.news.forEach((item) => lines.push(`${item.title}: ${this.absoluteUrl(item.url, siteUrl)}`));

    return `${lines.join("\n").trim()}\n`;
  }

  private renderLlmsFullText(items: LlmsItem[], generatedAt: string, siteUrl: string) {
    const sections = this.bySection(items);
    const lines = ["# YFYK", "", `Generated: ${generatedAt}`, "", "## Site"];

    this.appendFullSection(lines, sections.site, siteUrl);
    lines.push("", "## Cases");
    this.appendFullSection(lines, sections.cases, siteUrl);
    lines.push("", "## FAQs");
    this.appendFullSection(lines, sections.faqs, siteUrl);
    lines.push("", "## News");
    this.appendFullSection(lines, sections.news, siteUrl);

    return `${lines.join("\n").trim()}\n`;
  }

  private appendFullSection(lines: string[], items: LlmsItem[], siteUrl: string) {
    items.forEach((item) => {
      lines.push(`- ${item.title}${item.url ? `: ${this.absoluteUrl(item.url, siteUrl)}` : ""}`);
      if (item.summary) lines.push(`  AI Summary: ${this.clean(item.summary)}`);
      if (item.description) lines.push(`  Description: ${this.clean(item.description)}`);
      if (item.body) lines.push(`  Detail: ${this.clean(item.body, 600)}`);
    });
  }

  private createSnapshot(items: LlmsItem[]): LlmsSnapshot {
    const counts = {
      site: items.filter((item) => item.section === "site").length,
      cases: items.filter((item) => item.section === "cases").length,
      faqs: items.filter((item) => item.section === "faqs").length,
      news: items.filter((item) => item.section === "news").length
    };

    return {
      generatedAt: new Date().toISOString(),
      totalCount: items.length,
      counts,
      items: items.map(({ id, targetType, title, url, section }) => ({ id, targetType, title, url, section }))
    };
  }

  private bySection(items: LlmsItem[]) {
    return {
      site: items.filter((item) => item.section === "site").sort((a, b) => a.sortOrder - b.sortOrder),
      cases: items.filter((item) => item.section === "cases").sort((a, b) => a.sortOrder - b.sortOrder),
      faqs: items.filter((item) => item.section === "faqs").sort((a, b) => a.sortOrder - b.sortOrder),
      news: items.filter((item) => item.section === "news").sort((a, b) => a.sortOrder - b.sortOrder)
    };
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

  private async writePublished(result: LlmsSnapshot & { llmsText: string; llmsFullText: string }) {
    await mkdir(this.storageDir, { recursive: true });
    await Promise.all([
      writeFile(join(this.storageDir, "llms.txt"), result.llmsText, "utf8"),
      writeFile(join(this.storageDir, "llms-full.txt"), result.llmsFullText, "utf8"),
      writeFile(join(this.storageDir, "manifest.json"), JSON.stringify(result, null, 2), "utf8")
    ]);
  }

  private async readPublished() {
    try {
      const [llmsText, llmsFullText, manifestText] = await Promise.all([
        readFile(join(this.storageDir, "llms.txt"), "utf8"),
        readFile(join(this.storageDir, "llms-full.txt"), "utf8"),
        readFile(join(this.storageDir, "manifest.json"), "utf8")
      ]);
      const manifest = JSON.parse(manifestText) as LlmsSnapshot;
      return { ...manifest, llmsText, llmsFullText, published: true };
    } catch {
      return null;
    }
  }

  private key(targetType: GeoTargetType, targetId: string) {
    return `${targetType}:${targetId}`;
  }

  private clean(value: string, maxLength = 280) {
    const normalized = value.replace(/\s+/g, " ").trim();
    return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
  }

  private absoluteUrl(url: string | null, siteUrl: string) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
  }
}
