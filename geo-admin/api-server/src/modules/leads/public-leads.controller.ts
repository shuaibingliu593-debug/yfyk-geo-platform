import { Body, Controller, Headers, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { PublicApiService } from "../public-api/public-api.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadsService } from "./leads.service";

@Controller("v1/leads")
export class PublicLeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly publicApiService: PublicApiService
  ) {}

  @Post()
  async create(
    @Body() dto: CreateLeadDto,
    @Headers("referer") referer: string | undefined,
    @Headers("user-agent") userAgent: string | undefined,
    @Req() req: Request
  ) {
    const ip = this.resolveIp(req);
    const result = await this.leadsService.createPublic(dto, {
      referrer: referer,
      userAgent,
      ip
    });
    return this.publicApiService.wrap(result, "已收到您的咨询，我们会尽快与您联系。");
  }

  private resolveIp(req: Request): string | undefined {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
      return forwarded.split(",")[0]?.trim();
    }
    if (Array.isArray(forwarded) && forwarded[0]) {
      return forwarded[0].split(",")[0]?.trim();
    }
    return req.socket?.remoteAddress;
  }
}
