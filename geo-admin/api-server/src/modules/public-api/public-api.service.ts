import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CaseType, ContentStatus, GeoConfig, GeoTargetType, RelatedServiceType, ResourceStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { SettingsService } from "../settings/settings.service";

type PaginationQuery = {
  page?: string;
  pageSize?: string;
};

@Injectable()
export class PublicApiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService
  ) {}

  async staticResources(query: PaginationQuery) {
    const { page, pageSize, skip, take } = this.pagination(query);
    const [items, total] = await Promise.all([
      this.prisma.staticResource.findMany({
        where: { status: ResourceStatus.ACTIVE },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        skip,
        take
      }),
      this.prisma.staticResource.count({ where: { status: ResourceStatus.ACTIVE } })
    ]);
    const configs = await this.geoConfigs(GeoTargetType.STATIC_RESOURCE, items.map((item) => item.id));

    return this.paginated(
      items.map((item) => ({ ...item, geoConfig: configs.get(item.id) ?? null })),
      total,
      page,
      pageSize
    );
  }

  async cases(query: PaginationQuery & { caseType?: string; industry?: string }) {
    const { page, pageSize, skip, take } = this.pagination(query);
    const where = {
      status: ContentStatus.PUBLISHED,
      ...(query.caseType ? { caseType: this.toCaseType(query.caseType) } : {}),
      ...(query.industry ? { industry: query.industry } : {})
    };
    const [items, total] = await Promise.all([
      this.prisma.caseStudy.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
        skip,
        take
      }),
      this.prisma.caseStudy.count({ where })
    ]);
    const configs = await this.geoConfigs(GeoTargetType.CASE, items.map((item) => item.id));

    return this.paginated(
      items.map((item) => ({ ...item, geoConfig: configs.get(item.id) ?? null })),
      total,
      page,
      pageSize
    );
  }

  async caseBySlug(slug: string) {
    const item = await this.prisma.caseStudy.findFirst({ where: { slug, status: ContentStatus.PUBLISHED } });
    if (!item) this.notFound();
    const config = await this.geoConfig(GeoTargetType.CASE, item.id);
    return { ...item, geoConfig: config };
  }

  async faqs(query: PaginationQuery & { category?: string; relatedServiceType?: string; related_service_type?: string }) {
    const { page, pageSize, skip, take } = this.pagination(query);
    const relatedServiceType = query.relatedServiceType ?? query.related_service_type;
    const where = {
      status: ContentStatus.PUBLISHED,
      ...(query.category ? { category: query.category } : {}),
      ...(relatedServiceType ? { relatedServiceType: this.toRelatedServiceType(relatedServiceType) } : {})
    };
    const [items, total] = await Promise.all([
      this.prisma.faq.findMany({ where, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }], skip, take }),
      this.prisma.faq.count({ where })
    ]);
    const configs = await this.geoConfigs(GeoTargetType.FAQ, items.map((item) => item.id));

    return this.paginated(
      items.map((item) => ({ ...item, geoConfig: configs.get(item.id) ?? null })),
      total,
      page,
      pageSize
    );
  }

  async news(query: PaginationQuery & { category?: string }) {
    const { page, pageSize, skip, take } = this.pagination(query);
    const where = {
      status: ContentStatus.PUBLISHED,
      ...(query.category ? { category: query.category } : {})
    };
    const [items, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { publishDate: "desc" }, { updatedAt: "desc" }],
        skip,
        take
      }),
      this.prisma.newsArticle.count({ where })
    ]);
    const configs = await this.geoConfigs(GeoTargetType.NEWS, items.map((item) => item.id));

    return this.paginated(
      items.map((item) => ({ ...item, geoConfig: configs.get(item.id) ?? null })),
      total,
      page,
      pageSize
    );
  }

  async newsBySlug(slug: string) {
    const item = await this.prisma.newsArticle.findFirst({ where: { slug, status: ContentStatus.PUBLISHED } });
    if (!item) this.notFound();
    const config = await this.geoConfig(GeoTargetType.NEWS, item.id);
    return { ...item, geoConfig: config };
  }

  async homeRecommendations() {
    const cases = await this.prisma.caseStudy.findMany({
      where: { status: ContentStatus.PUBLISHED, featured: true },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      take: 5
    });
    const caseConfigs = await this.geoConfigs(
      GeoTargetType.CASE,
      cases.map((item) => item.id)
    );

    return {
      cases: cases.map((item) => ({ ...item, geoConfig: caseConfigs.get(item.id) ?? null }))
    };
  }

  wrap(data: unknown, message = "ok") {
    return { success: true, data, message };
  }

  private async geoConfig(targetType: GeoTargetType, targetId: string) {
    const config = await this.prisma.geoConfig.findUnique({ where: { targetType_targetId: { targetType, targetId } } });
    return config ? this.publicGeoConfig(config, await this.settingsService.getSiteUrl()) : null;
  }

  private async geoConfigs(targetType: GeoTargetType, targetIds: string[]) {
    const siteUrl = await this.settingsService.getSiteUrl();
    const configs = await this.prisma.geoConfig.findMany({ where: { targetType, targetId: { in: targetIds } } });
    return new Map(configs.map((config) => [config.targetId, this.publicGeoConfig(config, siteUrl)]));
  }

  private publicGeoConfig(config: GeoConfig, siteUrl: string) {
    return {
      ...config,
      canonicalUrl: config.canonicalUrl ? this.absoluteUrl(config.canonicalUrl, siteUrl) : null
    };
  }

  private pagination(query: PaginationQuery) {
    const page = Math.max(1, Number(query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize ?? 10)));
    return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
  }

  private paginated<T>(items: T[], total: number, page: number, pageSize: number) {
    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  private absoluteUrl(url: string, siteUrl: string) {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
  }

  private toCaseType(value: string) {
    const normalized = value.toUpperCase();
    if (normalized === "BENCHMARK" || normalized === "GEO_NATIVE" || normalized === "AI_UPGRADE" || normalized === "KNOWLEDGE_BASE") {
      return normalized as CaseType;
    }
    return value as CaseType;
  }

  private toRelatedServiceType(value: string) {
    const normalized = value.toUpperCase();
    if (normalized === "GEO_NATIVE_WEBSITE" || normalized === "AI_FRIENDLY_UPGRADE" || normalized === "ENTERPRISE_KNOWLEDGE_BASE" || normalized === "GENERAL") {
      return normalized as RelatedServiceType;
    }
    return value as RelatedServiceType;
  }

  private notFound(): never {
    throw new HttpException(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "资源不存在"
        }
      },
      HttpStatus.NOT_FOUND
    );
  }
}
