import { Controller, Get, Param } from "@nestjs/common";
import { StaticResourcesService } from "./static-resources.service";

@Controller("public/static-pages")
export class PublicStaticResourcesController {
  constructor(private readonly staticResourcesService: StaticResourcesService) {}

  @Get(":resourceKey/geo-config")
  getGeoConfig(@Param("resourceKey") resourceKey: string) {
    return this.staticResourcesService.getPublicGeoConfig(resourceKey);
  }
}
