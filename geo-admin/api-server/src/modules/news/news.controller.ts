import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { CreateNewsDto } from "./dto/create-news.dto";
import { ListNewsDto } from "./dto/list-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { NewsService } from "./news.service";

@Controller("news")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  list(@Query() query: ListNewsDto) {
    return this.newsService.list(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.newsService.get(id);
  }

  @Post()
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Patch(":id/publish")
  publish(@Param("id") id: string) {
    return this.newsService.publish(id);
  }

  @Patch(":id/offline")
  offline(@Param("id") id: string) {
    return this.newsService.offline(id);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.newsService.delete(id);
  }
}
