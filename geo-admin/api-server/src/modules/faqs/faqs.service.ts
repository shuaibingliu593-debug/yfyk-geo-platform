import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatus, GeoTargetType, Prisma, RelatedServiceType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFaqDto, FaqStatusValue, RelatedServiceTypeValue } from "./dto/create-faq.dto";
import { ListFaqsDto } from "./dto/list-faqs.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListFaqsDto) {
    const relatedServiceType = query.relatedServiceType ?? query.related_service_type;
    const serviceSearch = query.q ? this.tryRelatedServiceTypeEquals(query.q) : undefined;
    const where: Prisma.FaqWhereInput = {
      ...(query.category ? { category: { equals: query.category, mode: "insensitive" } } : {}),
      ...(relatedServiceType ? { relatedServiceType: this.toRelatedServiceType(relatedServiceType) } : {}),
      ...(query.status ? { status: this.toContentStatus(query.status) } : {}),
      ...(query.q
        ? {
            OR: [
              { question: { contains: query.q, mode: "insensitive" } },
              { answer: { contains: query.q, mode: "insensitive" } },
              { category: { contains: query.q, mode: "insensitive" } },
              ...(serviceSearch ? [{ relatedServiceType: serviceSearch }] : [])
            ] satisfies Prisma.FaqWhereInput[]
          }
        : {})
    };

    const faqs = await this.prisma.faq.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });

    const geoConfigs = await this.prisma.geoConfig.findMany({
      where: {
        targetType: GeoTargetType.FAQ,
        targetId: { in: faqs.map((item) => item.id) }
      }
    });
    const geoConfigByTargetId = new Map(geoConfigs.map((config) => [config.targetId, config]));

    return faqs.map((item) => ({ ...item, geoConfig: geoConfigByTargetId.get(item.id) ?? null }));
  }

  create(dto: CreateFaqDto) {
    return this.prisma.$transaction(async (tx) => {
      const faq = await tx.faq.create({
        data: this.toFaqCreateData(dto)
      });

      const geoConfig = await this.upsertGeoConfig(tx, faq);

      return { ...faq, geoConfig };
    });
  }

  async get(id: string) {
    const faq = await this.ensureExists(id);
    const geoConfig = await this.getGeoConfig(faq.id);
    return { ...faq, geoConfig };
  }

  update(id: string, dto: UpdateFaqDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.ensureExists(id);
      const faq = await tx.faq.update({
        where: { id },
        data: this.toFaqUpdateData(dto)
      });
      const geoConfig = await this.upsertGeoConfig(tx, faq);
      return { ...faq, geoConfig };
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.$transaction([
      this.prisma.geoIssue.deleteMany({ where: { targetType: GeoTargetType.FAQ, targetId: id } }),
      this.prisma.geoScore.deleteMany({ where: { targetType: GeoTargetType.FAQ, targetId: id } }),
      this.prisma.geoConfig.deleteMany({ where: { targetType: GeoTargetType.FAQ, targetId: id } }),
      this.prisma.faq.delete({ where: { id } })
    ]);
    return { deleted: true };
  }

  publish(id: string) {
    return this.update(id, { status: "published" });
  }

  offline(id: string) {
    return this.update(id, { status: "draft" });
  }

  publicList(query: Pick<ListFaqsDto, "category" | "relatedServiceType" | "related_service_type">) {
    const relatedServiceType = query.relatedServiceType ?? query.related_service_type;
    return this.prisma.faq.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(query.category ? { category: { equals: query.category, mode: "insensitive" } } : {}),
        ...(relatedServiceType ? { relatedServiceType: this.toRelatedServiceType(relatedServiceType) } : {})
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });
  }

  private toFaqCreateData(dto: CreateFaqDto): Prisma.FaqUncheckedCreateInput {
    return {
      question: dto.question,
      answer: dto.answer,
      category: dto.category,
      relatedServiceType: dto.relatedServiceType ? this.toRelatedServiceType(dto.relatedServiceType) : RelatedServiceType.GENERAL,
      sortOrder: dto.sortOrder ?? 0,
      status: dto.status ? this.toContentStatus(dto.status) : ContentStatus.DRAFT
    };
  }

  private toFaqUpdateData(dto: UpdateFaqDto): Prisma.FaqUncheckedUpdateInput {
    return this.withoutUndefined({
      question: dto.question,
      answer: dto.answer,
      category: dto.category,
      relatedServiceType: dto.relatedServiceType ? this.toRelatedServiceType(dto.relatedServiceType) : undefined,
      sortOrder: dto.sortOrder,
      status: dto.status ? this.toContentStatus(dto.status) : undefined
    }) as Prisma.FaqUncheckedUpdateInput;
  }

  private upsertGeoConfig(
    tx: Prisma.TransactionClient,
    faq: { id: string; question: string; answer: string; category: string | null; relatedServiceType: RelatedServiceType }
  ) {
    const schemaJson = this.withoutUndefined({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      },
      category: faq.category ?? undefined,
      relatedServiceType: this.fromRelatedServiceType(faq.relatedServiceType)
    }) as Prisma.InputJsonObject;

    return tx.geoConfig.upsert({
      where: { targetType_targetId: { targetType: GeoTargetType.FAQ, targetId: faq.id } },
      update: {
        aiSummary: faq.answer,
        metaTitle: faq.question,
        metaDescription: faq.answer.slice(0, 160),
        schemaType: "Question",
        schemaJson
      },
      create: {
        targetType: GeoTargetType.FAQ,
        targetId: faq.id,
        aiSummary: faq.answer,
        metaTitle: faq.question,
        metaDescription: faq.answer.slice(0, 160),
        schemaType: "Question",
        schemaJson
      }
    });
  }

  private async ensureExists(id: string) {
    const faq = await this.prisma.faq.findUnique({ where: { id } });
    if (!faq) {
      throw new NotFoundException("FAQ not found");
    }
    return faq;
  }

  private getGeoConfig(targetId: string) {
    return this.prisma.geoConfig.findUnique({
      where: { targetType_targetId: { targetType: GeoTargetType.FAQ, targetId } }
    });
  }

  private withoutUndefined<T extends object>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
  }

  private toContentStatus(value: FaqStatusValue): ContentStatus {
    const map: Record<FaqStatusValue, ContentStatus> = {
      draft: ContentStatus.DRAFT,
      published: ContentStatus.PUBLISHED,
      archived: ContentStatus.ARCHIVED
    };
    return map[value];
  }

  private toRelatedServiceType(value: RelatedServiceTypeValue): RelatedServiceType {
    const map: Record<RelatedServiceTypeValue, RelatedServiceType> = {
      geo_native_website: RelatedServiceType.GEO_NATIVE_WEBSITE,
      ai_friendly_upgrade: RelatedServiceType.AI_FRIENDLY_UPGRADE,
      enterprise_knowledge_base: RelatedServiceType.ENTERPRISE_KNOWLEDGE_BASE,
      general: RelatedServiceType.GENERAL
    };
    return map[value];
  }

  private fromRelatedServiceType(value: RelatedServiceType): RelatedServiceTypeValue {
    const map: Record<RelatedServiceType, RelatedServiceTypeValue> = {
      [RelatedServiceType.GEO_NATIVE_WEBSITE]: "geo_native_website",
      [RelatedServiceType.AI_FRIENDLY_UPGRADE]: "ai_friendly_upgrade",
      [RelatedServiceType.ENTERPRISE_KNOWLEDGE_BASE]: "enterprise_knowledge_base",
      [RelatedServiceType.GENERAL]: "general"
    };
    return map[value];
  }

  private tryRelatedServiceTypeEquals(value: string): Prisma.EnumRelatedServiceTypeFilter | undefined {
    const normalized = value as RelatedServiceTypeValue;
    if (["geo_native_website", "ai_friendly_upgrade", "enterprise_knowledge_base", "general"].includes(normalized)) {
      return { equals: this.toRelatedServiceType(normalized) };
    }
    return undefined;
  }
}
