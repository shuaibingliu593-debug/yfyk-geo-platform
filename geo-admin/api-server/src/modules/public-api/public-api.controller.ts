import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicApiService } from "./public-api.service";

@Controller("v1")
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @Get("geo/static-resources")
  async staticResources(@Query() query: Record<string, string>) {
    return this.publicApiService.wrap(await this.publicApiService.staticResources(query));
  }

  @Get("cases")
  async cases(@Query() query: Record<string, string>) {
    return this.publicApiService.wrap(await this.publicApiService.cases(query));
  }

  @Get("cases/:slug")
  async caseBySlug(@Param("slug") slug: string) {
    return this.publicApiService.wrap(await this.publicApiService.caseBySlug(slug));
  }

  @Get("faqs")
  async faqs(@Query() query: Record<string, string>) {
    return this.publicApiService.wrap(await this.publicApiService.faqs(query));
  }

  @Get("news")
  async news(@Query() query: Record<string, string>) {
    return this.publicApiService.wrap(await this.publicApiService.news(query));
  }

  @Get("news/:slug")
  async newsBySlug(@Param("slug") slug: string) {
    return this.publicApiService.wrap(await this.publicApiService.newsBySlug(slug));
  }

  @Get("home/recommendations")
  async homeRecommendations() {
    return this.publicApiService.wrap(await this.publicApiService.homeRecommendations());
  }
}
