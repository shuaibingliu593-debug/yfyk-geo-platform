import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { GeoTargetType, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateStaticResourceDto } from "./dto/create-static-resource.dto";
import { UpdateDetectionConfigDto } from "./dto/update-detection-config.dto";
import { UpdateGeoConfigDto } from "./dto/update-geo-config.dto";
import { PRESET_STATIC_RESOURCE_KEYS } from "./static-resource.constants";

@Injectable()
export class StaticResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const resources = await this.prisma.staticResource.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });

    const geoConfigs = await this.prisma.geoConfig.findMany({
      where: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: {
          in: resources.map((resource) => resource.id)
        }
      }
    });

    const geoConfigByTargetId = new Map(geoConfigs.map((config) => [config.targetId, config]));

    return resources.map((resource) => ({
      ...resource,
      geoConfig: geoConfigByTargetId.get(resource.id) ?? null
    }));
  }

  async listStaticPages() {
    const resources = await this.prisma.staticResource.findMany({
      where: {
        resourceKey: {
          in: Array.from(PRESET_STATIC_RESOURCE_KEYS)
        }
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });

    return this.attachGeoConfigs(resources);
  }

  async create(dto: CreateStaticResourceDto) {
    return this.prisma.$transaction(async (tx) => {
      const resource = await tx.staticResource.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          resourceKey: dto.resourceKey,
          resourceType: dto.resourceType,
          url: dto.url,
          sourceType: dto.sourceType,
          status: dto.status,
          sortOrder: dto.sortOrder ?? 0
        }
      });

      const geoConfig = await tx.geoConfig.create({
        data: {
          targetType: GeoTargetType.STATIC_RESOURCE,
          targetId: resource.id,
          metaTitle: resource.title,
          canonicalUrl: resource.url
        }
      });

      return { ...resource, geoConfig };
    });
  }

  async updateGeoConfig(id: string, dto: UpdateGeoConfigDto) {
    await this.ensureExists(id);

    return this.prisma.geoConfig.upsert({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.STATIC_RESOURCE,
          targetId: id
        }
      },
      update: this.toGeoConfigData(dto),
      create: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: id,
        ...this.toGeoConfigCreateData(dto)
      }
    });
  }

  async rescore(id: string) {
    const resource = await this.ensureExists(id);
    const geoConfig = await this.prisma.geoConfig.upsert({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.STATIC_RESOURCE,
          targetId: id
        }
      },
      update: {
        lastDetectedAt: new Date()
      },
      create: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: id,
        metaTitle: resource.title,
        canonicalUrl: resource.url,
        lastDetectedAt: new Date()
      }
    });

    const score = this.calculateGeoScore(geoConfig);
    const geoCheck = await this.prisma.geoCheck.create({
      data: {
        geoConfigId: geoConfig.id,
        score,
        findings: {
          source: "manual_rescore",
          targetType: GeoTargetType.STATIC_RESOURCE,
          targetId: id,
          checks: {
            hasAiSummary: Boolean(geoConfig.aiSummary),
            hasMetaTitle: Boolean(geoConfig.metaTitle),
            hasMetaDescription: Boolean(geoConfig.metaDescription),
            hasCanonicalUrl: Boolean(geoConfig.canonicalUrl),
            hasSchema: Boolean(geoConfig.schemaType && geoConfig.schemaJson)
          }
        }
      }
    });

    return { geoConfig, geoCheck };
  }

  async getPublicGeoConfig(resourceKey: string) {
    const resource = await this.prisma.staticResource.findUnique({
      where: { resourceKey }
    });

    if (!resource) {
      throw new NotFoundException("Static resource not found");
    }

    const geoConfig = await this.prisma.geoConfig.findUnique({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.STATIC_RESOURCE,
          targetId: resource.id
        }
      }
    });

    return { resource, geoConfig };
  }

  async updateDetectionConfig(id: string, dto: UpdateDetectionConfigDto) {
    await this.ensureExists(id);

    return this.prisma.geoConfig.upsert({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.STATIC_RESOURCE,
          targetId: id
        }
      },
      update: {
        detectEnabled: dto.detectEnabled
      },
      create: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: id,
        detectEnabled: dto.detectEnabled
      }
    });
  }

  async delete(id: string) {
    const resource = await this.ensureExists(id);

    if (PRESET_STATIC_RESOURCE_KEYS.has(resource.resourceKey)) {
      throw new ForbiddenException("Preset static resources cannot be deleted");
    }

    await this.prisma.$transaction([
      this.prisma.geoIssue.deleteMany({ where: { targetType: GeoTargetType.STATIC_RESOURCE, targetId: id } }),
      this.prisma.geoScore.deleteMany({ where: { targetType: GeoTargetType.STATIC_RESOURCE, targetId: id } }),
      this.prisma.geoConfig.deleteMany({ where: { targetType: GeoTargetType.STATIC_RESOURCE, targetId: id } }),
      this.prisma.staticResource.delete({ where: { id } })
    ]);

    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const resource = await this.prisma.staticResource.findUnique({ where: { id } });

    if (!resource) {
      throw new NotFoundException("Static resource not found");
    }

    return resource;
  }

  private async attachGeoConfigs<T extends { id: string }>(resources: T[]) {
    const geoConfigs = await this.prisma.geoConfig.findMany({
      where: {
        targetType: GeoTargetType.STATIC_RESOURCE,
        targetId: {
          in: resources.map((resource) => resource.id)
        }
      }
    });

    const geoConfigByTargetId = new Map(geoConfigs.map((config) => [config.targetId, config]));

    return resources.map((resource) => ({
      ...resource,
      geoConfig: geoConfigByTargetId.get(resource.id) ?? null
    }));
  }

  private calculateGeoScore(config: { aiSummary: string | null; metaTitle: string | null; metaDescription: string | null; canonicalUrl: string | null; schemaType: string | null; schemaJson: Prisma.JsonValue | null }) {
    const checks = [
      Boolean(config.aiSummary),
      Boolean(config.metaTitle),
      Boolean(config.metaDescription),
      Boolean(config.canonicalUrl),
      Boolean(config.schemaType),
      Boolean(config.schemaJson)
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  private withoutUndefined<T extends object>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
  }

  private toGeoConfigData(dto: UpdateGeoConfigDto): Prisma.GeoConfigUncheckedUpdateInput {
    return this.withoutUndefined(dto) as Prisma.GeoConfigUncheckedUpdateInput;
  }

  private toGeoConfigCreateData(dto: UpdateGeoConfigDto): Omit<Prisma.GeoConfigUncheckedCreateInput, "id" | "targetType" | "targetId"> {
    return this.withoutUndefined(dto) as Omit<Prisma.GeoConfigUncheckedCreateInput, "id" | "targetType" | "targetId">;
  }
}
