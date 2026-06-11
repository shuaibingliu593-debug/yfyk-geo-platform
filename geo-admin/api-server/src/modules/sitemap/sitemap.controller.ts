import { Body, Controller, Get, Header, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsNumber, Max, Min } from "class-validator";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { SitemapService } from "./sitemap.service";

class UpdateSitemapPriorityDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  priority!: number;
}

@Controller("v1/sitemap")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  state() {
    return this.sitemapService.getAdminState();
  }

  @Post("generate")
  generate(@Body("publish") publish?: boolean) {
    return this.sitemapService.generate({ publish: Boolean(publish) });
  }

  @Patch("configs/:id/priority")
  updatePriority(@Param("id") id: string, @Body() dto: UpdateSitemapPriorityDto) {
    return this.sitemapService.updatePriority(id, dto.priority);
  }
}

@Controller()
export class PublicSitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get("ai-sitemap.xml")
  @Header("Content-Type", "application/xml; charset=utf-8")
  sitemapXml() {
    return this.sitemapService.getPublicXml();
  }
}
