import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { ListFaqsDto } from "./dto/list-faqs.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { FaqsService } from "./faqs.service";

@Controller("faqs")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  list(@Query() query: ListFaqsDto) {
    return this.faqsService.list(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.faqsService.get(id);
  }

  @Post()
  create(@Body() dto: CreateFaqDto) {
    return this.faqsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFaqDto) {
    return this.faqsService.update(id, dto);
  }

  @Patch(":id/publish")
  publish(@Param("id") id: string) {
    return this.faqsService.publish(id);
  }

  @Patch(":id/offline")
  offline(@Param("id") id: string) {
    return this.faqsService.offline(id);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.faqsService.delete(id);
  }
}
