import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { UpdateSchemaConfigDto } from "./dto/update-schema-config.dto";
import { GeoService } from "./geo.service";

@Controller("geo")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get("capabilities")
  capabilities() {
    return {
      staticPages: ["home", "services", "knowledge", "glossary", "patents", "about", "contact"],
      capabilities: ["geo-config", "auto-check", "llms.txt", "ai-sitemap", "geo-score"]
    };
  }

  @Get("configs")
  configs() {
    return this.geoService.listConfigs();
  }

  @Get("schema-configs")
  schemaConfigs(@Query("targetType") targetType?: string, @Query("schemaType") schemaType?: string) {
    return this.geoService.listSchemaConfigs({ targetType, schemaType });
  }

  @Patch("configs/:id/schema")
  updateSchema(@Param("id") id: string, @Body() dto: UpdateSchemaConfigDto) {
    return this.geoService.updateSchemaConfig(id, dto);
  }

  @Post("configs/:id/rescore")
  rescore(@Param("id") id: string) {
    return this.geoService.rescoreConfig(id);
  }

  @Get("llms-configs")
  llmsConfigs() {
    return this.geoService.listLlmsConfigs();
  }

  @Get("sitemap-configs")
  sitemapConfigs() {
    return this.geoService.listSitemapConfigs();
  }

  @Get("detectable-configs")
  detectableConfigs() {
    return this.geoService.listDetectableConfigs();
  }

  @Get("scorable-configs")
  scorableConfigs() {
    return this.geoService.listScorableConfigs();
  }
}
