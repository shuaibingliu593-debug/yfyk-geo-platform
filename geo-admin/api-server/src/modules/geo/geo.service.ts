import { Injectable, NotFoundException } from "@nestjs/common";
import { GeoConfig, GeoTargetType, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateSchemaConfigDto } from "./dto/update-schema-config.dto";

@Injectable()
export class GeoService {
  constructor(private readonly prisma: PrismaService) {}

  listConfigs() {
    return this.prisma.geoConfig.findMany({
      orderBy: { updatedAt: "desc" }
    });
  }

  async listSchemaConfigs(filters: { targetType?: string; schemaType?: string }) {
    const targetType = this.toGeoTargetType(filters.targetType);
    const configs = await this.prisma.geoConfig.findMany({
      where: {
        ...(targetType ? { targetType } : {}),
        ...(filters.schemaType ? { schemaType: filters.schemaType } : {})
      },
      include: {
        geoChecks: {
          orderBy: { checkedAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const labels = await this.resolveTargetLabels(configs);

    return configs.map((config) => ({
      ...config,
      target: labels.get(this.targetKey(config.targetType, config.targetId)) ?? {
        title: config.targetId,
        url: null
      },
      schemaEnabled: Boolean(config.schemaJson),
      schemaStatus: this.getSchemaStatus(config.schemaJson)
    }));
  }

  async updateSchemaConfig(id: string, dto: UpdateSchemaConfigDto) {
    await this.ensureGeoConfig(id);

    return this.prisma.geoConfig.update({
      where: { id },
      data: {
        schemaType: dto.schemaJson === null ? null : dto.schemaType,
        schemaJson: dto.schemaJson === null ? Prisma.JsonNull : dto.schemaJson
      }
    });
  }

  async rescoreConfig(id: string) {
    const config = await this.ensureGeoConfig(id);
    const score = this.calculateGeoScore(config);

    const updated = await this.prisma.geoConfig.update({
      where: { id },
      data: { lastDetectedAt: new Date() }
    });

    const geoCheck = await this.prisma.geoCheck.create({
      data: {
        geoConfigId: id,
        score,
        findings: {
          source: "schema_rescore",
          checks: {
            hasSchemaJson: Boolean(config.schemaJson),
            hasSchemaType: Boolean(config.schemaType),
            hasContext: this.hasJsonLdKey(config.schemaJson, "@context"),
            hasType: this.hasJsonLdKey(config.schemaJson, "@type")
          }
        }
      }
    });

    return { geoConfig: updated, geoCheck };
  }

  listLlmsConfigs() {
    return this.prisma.geoConfig.findMany({
      where: { llmsEnabled: true },
      orderBy: { updatedAt: "desc" }
    });
  }

  listSitemapConfigs() {
    return this.prisma.geoConfig.findMany({
      where: { sitemapEnabled: true },
      orderBy: [{ sitemapPriority: "desc" }, { updatedAt: "desc" }]
    });
  }

  listDetectableConfigs() {
    return this.prisma.geoConfig.findMany({
      where: { detectEnabled: true },
      orderBy: { updatedAt: "desc" }
    });
  }

  listScorableConfigs() {
    return this.prisma.geoConfig.findMany({
      where: { detectEnabled: true },
      include: {
        geoChecks: {
          orderBy: { checkedAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" }
    });
  }

  private async ensureGeoConfig(id: string) {
    const config = await this.prisma.geoConfig.findUnique({ where: { id } });

    if (!config) {
      throw new NotFoundException("GEO config not found");
    }

    return config;
  }

  private async resolveTargetLabels(configs: GeoConfig[]) {
    const labels = new Map<string, { title: string; url: string | null }>();
    const idsByType = configs.reduce<Record<GeoTargetType, string[]>>(
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

    const [staticResources, cases, faqs, news] = await Promise.all([
      this.prisma.staticResource.findMany({ where: { id: { in: idsByType.STATIC_RESOURCE } } }),
      this.prisma.caseStudy.findMany({ where: { id: { in: idsByType.CASE } } }),
      this.prisma.faq.findMany({ where: { id: { in: idsByType.FAQ } } }),
      this.prisma.newsArticle.findMany({ where: { id: { in: idsByType.NEWS } } })
    ]);

    staticResources.forEach((item) => labels.set(this.targetKey(GeoTargetType.STATIC_RESOURCE, item.id), { title: item.title, url: item.url }));
    cases.forEach((item) => labels.set(this.targetKey(GeoTargetType.CASE, item.id), { title: item.title, url: `/cases/${item.slug}` }));
    faqs.forEach((item) => labels.set(this.targetKey(GeoTargetType.FAQ, item.id), { title: item.question, url: null }));
    news.forEach((item) => labels.set(this.targetKey(GeoTargetType.NEWS, item.id), { title: item.title, url: `/news/${item.slug}` }));

    return labels;
  }

  private targetKey(targetType: GeoTargetType, targetId: string) {
    return `${targetType}:${targetId}`;
  }

  private toGeoTargetType(value?: string): GeoTargetType | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = value.toUpperCase();
    if (normalized === "STATIC_RESOURCE" || normalized === "CASE" || normalized === "FAQ" || normalized === "NEWS") {
      return normalized as GeoTargetType;
    }

    return undefined;
  }

  private getSchemaStatus(schemaJson: Prisma.JsonValue | null) {
    if (!schemaJson) {
      return "disabled";
    }

    return this.hasJsonLdKey(schemaJson, "@context") && this.hasJsonLdKey(schemaJson, "@type") ? "valid" : "incomplete";
  }

  private calculateGeoScore(config: GeoConfig) {
    const checks = [
      Boolean(config.aiSummary),
      Boolean(config.metaTitle),
      Boolean(config.metaDescription),
      Boolean(config.canonicalUrl),
      Boolean(config.schemaType),
      Boolean(config.schemaJson),
      this.hasJsonLdKey(config.schemaJson, "@context"),
      this.hasJsonLdKey(config.schemaJson, "@type")
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  private hasJsonLdKey(value: Prisma.JsonValue | null, key: "@context" | "@type") {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    return key in value;
  }
}
