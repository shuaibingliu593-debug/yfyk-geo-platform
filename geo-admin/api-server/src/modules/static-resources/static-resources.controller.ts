import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { CreateStaticResourceDto } from "./dto/create-static-resource.dto";
import { UpdateDetectionConfigDto } from "./dto/update-detection-config.dto";
import { UpdateGeoConfigDto } from "./dto/update-geo-config.dto";
import { StaticResourcesService } from "./static-resources.service";

@Controller("static-resources")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class StaticResourcesController {
  constructor(private readonly staticResourcesService: StaticResourcesService) {}

  @Get()
  list() {
    return this.staticResourcesService.list();
  }

  @Get("static-pages")
  listStaticPages() {
    return this.staticResourcesService.listStaticPages();
  }

  @Post()
  create(@Body() dto: CreateStaticResourceDto) {
    return this.staticResourcesService.create(dto);
  }

  @Patch(":id/geo-config")
  updateGeoConfig(@Param("id") id: string, @Body() dto: UpdateGeoConfigDto) {
    return this.staticResourcesService.updateGeoConfig(id, dto);
  }

  @Patch(":id/detection-config")
  updateDetectionConfig(@Param("id") id: string, @Body() dto: UpdateDetectionConfigDto) {
    return this.staticResourcesService.updateDetectionConfig(id, dto);
  }

  @Post(":id/rescore")
  rescore(@Param("id") id: string) {
    return this.staticResourcesService.rescore(id);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.staticResourcesService.delete(id);
  }
}
