import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatus, GeoTargetType, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { ListCasesDto } from "./dto/list-cases.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListCasesDto) {
    const where: Prisma.CaseStudyWhereInput = {
      ...(query.caseType ? { caseType: query.caseType } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.industry ? { industry: { contains: query.industry, mode: "insensitive" } } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" } },
              { slug: { contains: query.q, mode: "insensitive" } },
              { industry: { contains: query.q, mode: "insensitive" } },
              { clientName: { contains: query.q, mode: "insensitive" } },
              { clientDisplayName: { contains: query.q, mode: "insensitive" } },
              { excerpt: { contains: query.q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const cases = await this.prisma.caseStudy.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });

    const geoConfigs = await this.prisma.geoConfig.findMany({
      where: {
        targetType: GeoTargetType.CASE,
        targetId: { in: cases.map((item) => item.id) }
      }
    });
    const geoConfigByTargetId = new Map(geoConfigs.map((config) => [config.targetId, config]));

    return cases.map((item) => ({ ...item, geoConfig: geoConfigByTargetId.get(item.id) ?? null }));
  }

  create(dto: CreateCaseDto) {
    return this.prisma.$transaction(async (tx) => {
      const caseStudy = await tx.caseStudy.create({
        data: {
          ...this.toCaseCreateData(dto),
          publishedAt: dto.status === ContentStatus.PUBLISHED ? new Date() : null
        }
      });

      const geoConfig = await this.upsertGeoConfig(tx, caseStudy.id, {
        title: caseStudy.title,
        slug: caseStudy.slug,
        excerpt: caseStudy.excerpt,
        metrics: caseStudy.metrics
      });

      return { ...caseStudy, geoConfig };
    });
  }

  async get(id: string) {
    const caseStudy = await this.prisma.caseStudy.findUnique({ where: { id } });

    if (!caseStudy) {
      throw new NotFoundException("Case not found");
    }

    const geoConfig = await this.prisma.geoConfig.findUnique({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.CASE,
          targetId: caseStudy.id
        }
      }
    });

    return { ...caseStudy, geoConfig };
  }

  async getPublishedBySlug(slug: string) {
    const caseStudy = await this.prisma.caseStudy.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED
      }
    });

    if (!caseStudy) {
      throw new NotFoundException("Case not found");
    }

    const geoConfig = await this.prisma.geoConfig.findUnique({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.CASE,
          targetId: caseStudy.id
        }
      }
    });

    return { ...caseStudy, geoConfig };
  }

  update(id: string, dto: UpdateCaseDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.ensureExists(id);

      const caseStudy = await tx.caseStudy.update({
        where: { id },
        data: this.toCaseUpdateData(dto)
      });

      const geoConfig = await this.upsertGeoConfig(tx, caseStudy.id, {
        title: caseStudy.title,
        slug: caseStudy.slug,
        excerpt: caseStudy.excerpt,
        metrics: caseStudy.metrics
      });

      return { ...caseStudy, geoConfig };
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);

    await this.prisma.$transaction([
      this.prisma.geoIssue.deleteMany({ where: { targetType: GeoTargetType.CASE, targetId: id } }),
      this.prisma.geoScore.deleteMany({ where: { targetType: GeoTargetType.CASE, targetId: id } }),
      this.prisma.geoConfig.deleteMany({
        where: {
          targetType: GeoTargetType.CASE,
          targetId: id
        }
      }),
      this.prisma.caseStudy.delete({ where: { id } })
    ]);

    return { deleted: true };
  }

  publish(id: string) {
    return this.update(id, {
      status: ContentStatus.PUBLISHED
    });
  }

  offline(id: string) {
    return this.update(id, {
      status: ContentStatus.DRAFT
    });
  }

  private async ensureExists(id: string) {
    const caseStudy = await this.prisma.caseStudy.findUnique({ where: { id } });

    if (!caseStudy) {
      throw new NotFoundException("Case not found");
    }

    return caseStudy;
  }

  private toCaseCreateData(dto: CreateCaseDto): Prisma.CaseStudyUncheckedCreateInput {
    return {
      title: dto.title,
      slug: dto.slug,
      caseType: dto.caseType,
      industry: dto.industry,
      clientName: dto.clientName,
      clientDisplayName: dto.clientDisplayName,
      isAnonymized: dto.isAnonymized ?? false,
      challenge: dto.challenge,
      solution: dto.solution,
      results: dto.results,
      metrics: dto.metrics,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImage: dto.coverImage,
      relatedServiceType: dto.relatedServiceType,
      status: dto.status ?? ContentStatus.DRAFT,
      featured: dto.featured ?? false,
      sortOrder: dto.sortOrder ?? 0
    };
  }

  private toCaseUpdateData(dto: UpdateCaseDto): Prisma.CaseStudyUncheckedUpdateInput {
    const status = dto.status;
    const publishedAt = status === ContentStatus.PUBLISHED ? new Date() : status === ContentStatus.DRAFT ? null : undefined;

    return this.withoutUndefined({
      title: dto.title,
      slug: dto.slug,
      caseType: dto.caseType,
      industry: dto.industry,
      clientName: dto.clientName,
      clientDisplayName: dto.clientDisplayName,
      isAnonymized: dto.isAnonymized,
      challenge: dto.challenge,
      solution: dto.solution,
      results: dto.results,
      metrics: dto.metrics,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImage: dto.coverImage,
      relatedServiceType: dto.relatedServiceType,
      status,
      featured: dto.featured,
      sortOrder: dto.sortOrder,
      publishedAt
    }) as Prisma.CaseStudyUncheckedUpdateInput;
  }

  private upsertGeoConfig(
    tx: Prisma.TransactionClient,
    targetId: string,
    data: { title: string; slug: string; excerpt?: string | null; metrics?: Prisma.JsonValue | null }
  ) {
    const schemaJson = this.withoutUndefined({
      "@type": "CaseStudy",
      name: data.title,
      description: data.excerpt ?? undefined,
      url: `/cases/${data.slug}`,
      metrics: data.metrics ?? undefined
    }) as Prisma.InputJsonObject;

    return tx.geoConfig.upsert({
      where: {
        targetType_targetId: {
          targetType: GeoTargetType.CASE,
          targetId
        }
      },
      update: {
        aiSummary: data.excerpt,
        metaTitle: data.title,
        metaDescription: data.excerpt,
        canonicalUrl: `/cases/${data.slug}`,
        schemaType: "CaseStudy",
        schemaJson
      },
      create: {
        targetType: GeoTargetType.CASE,
        targetId,
        aiSummary: data.excerpt,
        metaTitle: data.title,
        metaDescription: data.excerpt,
        canonicalUrl: `/cases/${data.slug}`,
        schemaType: "CaseStudy",
        schemaJson
      }
    });
  }

  private withoutUndefined<T extends object>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
  }
}
