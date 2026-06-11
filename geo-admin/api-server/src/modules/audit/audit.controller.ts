import { Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { AuditService } from "./audit.service";

@Controller("v1/audit")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("scores")
  scores(@Query("targetType") targetType?: string, @Query("scoreBand") scoreBand?: "all" | "excellent" | "good" | "warning" | "poor") {
    return this.auditService.listScores({ targetType, scoreBand });
  }

  @Get("issues")
  issues(@Query("targetType") targetType?: string, @Query("severity") severity?: string, @Query("status") status?: string) {
    return this.auditService.listIssues({ targetType, severity, status });
  }

  @Post("rescore")
  rescoreAll() {
    return this.auditService.rescoreAll();
  }

  @Post("scores/:targetType/:targetId/rescore")
  rescoreOne(@Param("targetType") targetType: string, @Param("targetId") targetId: string) {
    return this.auditService.rescoreOne(targetType, targetId);
  }

  @Patch("issues/:id/resolve")
  resolveIssue(@Param("id") id: string) {
    return this.auditService.resolveIssue(id);
  }
}
