import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { ListLeadsDto } from "./dto/list-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { LeadsService } from "./leads.service";

@Controller("admin/leads")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  list(@Query() query: ListLeadsDto) {
    return this.leadsService.list(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.leadsService.get(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.leadsService.delete(id);
  }
}
