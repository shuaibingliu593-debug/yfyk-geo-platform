import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatus, GeoTargetType, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { ListNewsDto } from "./dto/list-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListNewsDto) {
    const where: Prisma.NewsArticleWhereInput = {
      ...(query.category ? { category: { equals: query.category, mode: "insensitive" } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" } },
              { slug: { contains: query.q, mode: "insensitive" } },
              { category: { contains: query.q, mode: "insensitive" } },
              { source: { contains: query.q, mode: "insensitive" } },
              { author: { contains: query.q, mode: "insensitive" } },
              { excerpt: { contains: query.q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const articles = await this.prisma.newsArticle.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });

    const geoConfigs = await this.prisma.geoConfig.findMany({
      where: {
        targetType: GeoTargetType.NEWS,
        targetId: { in: articles.map((item) => item.id) }
      }
    });
    const geoConfigByTargetId = new Map(geoConfigs.map((config) => [config.targetId, config]));

    return articles.map((item) => ({ ...item, geoConfig: geoConfigByTargetId.get(item.id) ?? null }));
  }

  create(dto: CreateNewsDto) {
    return this.prisma.$transaction(async (tx) => {
      const article = await tx.newsArticle.create({
        data: {
          ...this.toNewsCreateData(dto),
          publishedAt: dto.status === ContentStatus.PUBLISHED ? new Date() : null
        }
      });

      const geoConfig = await this.upsertGeoConfig(tx, article);

      return { ...article, geoConfig };
    });
  }

  async get(id: string) {
    const article = await this.ensureExists(id);
    const geoConfig = await this.getGeoConfig(article.id);
    return { ...article, geoConfig };
  }

  async getPublishedBySlug(slug: string) {
    const article = await this.prisma.newsArticle.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED
      }
    });

    if (!article) {
      throw new NotFoundException("News article not found");
    }

    const geoConfig = await this.getGeoConfig(article.id);
    return { ...article, geoConfig };
  }

  update(id: string, dto: UpdateNewsDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.ensureExists(id);
      const article = await tx.newsArticle.update({
        where: { id },
        data: this.toNewsUpdateData(dto)
      });
      const geoConfig = await this.upsertGeoConfig(tx, article);
      return { ...article, geoConfig };
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.$transaction([
      this.prisma.geoIssue.deleteMany({ where: { targetType: GeoTargetType.NEWS, targetId: id } }),
      this.prisma.geoScore.deleteMany({ where: { targetType: GeoTargetType.NEWS, targetId: id } }),
      this.prisma.geoConfig.deleteMany({ where: { targetType: GeoTargetType.NEWS, targetId: id } }),
      this.prisma.newsArticle.delete({ where: { id } })
    ]);
    return { deleted: true };
  }

  publish(id: string) {
    return this.update(id, { status: ContentStatus.PUBLISHED });
  }

  offline(id: string) {
    return this.update(id, { status: ContentStatus.DRAFT });
  }

  private toNewsCreateData(dto: CreateNewsDto): Prisma.NewsArticleUncheckedCreateInput {
    return {
      title: dto.title,
      slug: dto.slug,
      category: dto.category,
      source: dto.source,
      author: dto.author,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImage: dto.coverImage,
      publishDate: dto.publishDate ? new Date(dto.publishDate) : undefined,
      status: dto.status ?? ContentStatus.DRAFT,
      sortOrder: dto.sortOrder ?? 0
    };
  }

  private toNewsUpdateData(dto: UpdateNewsDto): Prisma.NewsArticleUncheckedUpdateInput {
    const status = dto.status;
    const publishedAt = status === ContentStatus.PUBLISHED ? new Date() : status === ContentStatus.DRAFT ? null : undefined;

    return this.withoutUndefined({
      title: dto.title,
      slug: dto.slug,
      category: dto.category,
      source: dto.source,
      author: dto.author,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImage: dto.coverImage,
      publishDate: dto.publishDate ? new Date(dto.publishDate) : undefined,
      status,
      sortOrder: dto.sortOrder,
      publishedAt
    }) as Prisma.NewsArticleUncheckedUpdateInput;
  }

  private upsertGeoConfig(tx: Prisma.TransactionClient, article: { id: string; title: string; slug: string; excerpt: string | null; category: string | null; author: string | null; publishDate: Date | null }) {
    const schemaJson = this.withoutUndefined({
      "@type": "NewsArticle",
      headline: article.title,
      description: article.excerpt ?? undefined,
      url: `/news/${article.slug}`,
      author: article.author ?? undefined,
      articleSection: article.category ?? undefined,
      datePublished: article.publishDate?.toISOString()
    }) as Prisma.InputJsonObject;

    return tx.geoConfig.upsert({
      where: { targetType_targetId: { targetType: GeoTargetType.NEWS, targetId: article.id } },
      update: {
        aiSummary: article.excerpt,
        metaTitle: article.title,
        metaDescription: article.excerpt,
        canonicalUrl: `/news/${article.slug}`,
        schemaType: "NewsArticle",
        schemaJson
      },
      create: {
        targetType: GeoTargetType.NEWS,
        targetId: article.id,
        aiSummary: article.excerpt,
        metaTitle: article.title,
        metaDescription: article.excerpt,
        canonicalUrl: `/news/${article.slug}`,
        schemaType: "NewsArticle",
        schemaJson
      }
    });
  }

  private async ensureExists(id: string) {
    const article = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException("News article not found");
    }
    return article;
  }

  private getGeoConfig(targetId: string) {
    return this.prisma.geoConfig.findUnique({
      where: { targetType_targetId: { targetType: GeoTargetType.NEWS, targetId } }
    });
  }

  private withoutUndefined<T extends object>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
  }
}
