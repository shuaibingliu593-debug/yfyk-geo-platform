import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { CasesService } from "./cases.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { ListCasesDto } from "./dto/list-cases.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";

@Controller("cases")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  list(@Query() query: ListCasesDto) {
    return this.casesService.list(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.casesService.get(id);
  }

  @Post()
  create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCaseDto) {
    return this.casesService.update(id, dto);
  }

  @Patch(":id/publish")
  publish(@Param("id") id: string) {
    return this.casesService.publish(id);
  }

  @Patch(":id/offline")
  offline(@Param("id") id: string) {
    return this.casesService.offline(id);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.casesService.delete(id);
  }
}
