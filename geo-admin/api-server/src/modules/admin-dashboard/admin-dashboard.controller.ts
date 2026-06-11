import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { AdminDashboardService } from "./admin-dashboard.service";

@Controller("v1/admin/dashboard")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get("overview")
  overview() {
    return this.dashboardService.overview();
  }
}
