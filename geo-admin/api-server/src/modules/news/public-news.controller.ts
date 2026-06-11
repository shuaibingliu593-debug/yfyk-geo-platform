import { Controller, Get, Param } from "@nestjs/common";
import { NewsService } from "./news.service";

@Controller("public/news")
export class PublicNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.newsService.getPublishedBySlug(slug);
  }
}
