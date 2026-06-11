import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LeadStatus, Prisma } from "@prisma/client";
import { checkIpRateLimit } from "../../common/ip-rate-limit";
import { sanitizeRequiredText, sanitizeText } from "../../common/text-sanitize";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { ListLeadsDto } from "./dto/list-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPublic(
    dto: CreateLeadDto,
    meta: { referrer?: string; userAgent?: string; ip?: string }
  ) {
    const ip = meta.ip?.trim() || "unknown";
    const rate = checkIpRateLimit(ip, 10, 60_000);
    if (!rate.allowed) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "提交过于频繁，请稍后再试"
          }
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    let data;
    try {
      data = {
        name: sanitizeRequiredText(dto.name, 100, "姓名"),
        companyName: sanitizeText(dto.companyName, 200),
        contact: sanitizeRequiredText(dto.contact, 200, "联系方式"),
        demandType: sanitizeRequiredText(dto.demandType, 100, "需求类型"),
        message: sanitizeText(dto.message, 2000),
        sourcePage: sanitizeRequiredText(dto.sourcePage, 500, "来源页面"),
        sourcePageTitle: sanitizeText(dto.sourcePageTitle, 200),
        sourceModule: sanitizeRequiredText(dto.sourceModule, 100, "来源模块"),
        sourceButtonText: sanitizeText(dto.sourceButtonText, 100),
        referrer: sanitizeText(meta.referrer, 500),
        userAgent: sanitizeText(meta.userAgent, 500),
        ip: sanitizeText(ip === "unknown" ? undefined : ip, 64)
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "提交内容无效");
    }

    const lead = await this.prisma.lead.create({ data });
    return { id: lead.id };
  }

  async list(query: ListLeadsDto) {
    const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(query.pageSize ?? "20", 10) || 20));
    const skip = (page - 1) * pageSize;

    const where = this.buildWhere(query);
    const [items, total, stats] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize
      }),
      this.prisma.lead.count({ where }),
      this.getStats()
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
      },
      stats
    };
  }

  async get(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new HttpException({ message: "留言不存在" }, HttpStatus.NOT_FOUND);
    }
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.get(id);
    return this.prisma.lead.update({
      where: { id },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.note !== undefined ? { note: sanitizeText(dto.note, 2000) ?? null } : {})
      }
    });
  }

  async delete(id: string) {
    await this.get(id);
    await this.prisma.lead.delete({ where: { id } });
    return { deleted: true };
  }

  private buildWhere(query: ListLeadsDto): Prisma.LeadWhereInput {
    const where: Prisma.LeadWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.demandType?.trim()) {
      where.demandType = query.demandType.trim();
    }
    if (query.sourcePage?.trim()) {
      where.sourcePage = query.sourcePage.trim();
    }

    const keyword = query.keyword?.trim();
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { companyName: { contains: keyword, mode: "insensitive" } },
        { contact: { contains: keyword, mode: "insensitive" } },
        { message: { contains: keyword, mode: "insensitive" } }
      ];
    }

    const dateFrom = query.dateFrom ? new Date(query.dateFrom) : null;
    const dateTo = query.dateTo ? new Date(query.dateTo) : null;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom && !Number.isNaN(dateFrom.getTime())) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo && !Number.isNaN(dateTo.getTime())) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    return where;
  }

  private async getStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [todayNew, pending, done, total] = await Promise.all([
      this.prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.lead.count({
        where: { status: { in: [LeadStatus.NEW, LeadStatus.FOLLOWING] } }
      }),
      this.prisma.lead.count({ where: { status: LeadStatus.DONE } }),
      this.prisma.lead.count()
    ]);

    return { todayNew, pending, done, total };
  }
}
