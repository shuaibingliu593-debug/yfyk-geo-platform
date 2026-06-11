import { Controller, Get, Query } from "@nestjs/common";
import { ListFaqsDto } from "./dto/list-faqs.dto";
import { FaqsService } from "./faqs.service";

@Controller("public/faqs")
export class PublicFaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  list(@Query() query: Pick<ListFaqsDto, "category" | "relatedServiceType" | "related_service_type">) {
    return this.faqsService.publicList(query);
  }
}
