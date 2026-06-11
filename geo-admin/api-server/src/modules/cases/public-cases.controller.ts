import { Controller, Get, Param } from "@nestjs/common";
import { CasesService } from "./cases.service";

@Controller("public/cases")
export class PublicCasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.casesService.getPublishedBySlug(slug);
  }
}
