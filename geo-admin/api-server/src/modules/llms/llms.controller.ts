import { Body, Controller, Get, Header, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../../rbac/roles.decorator";
import { RolesGuard } from "../../rbac/roles.guard";
import { LlmsService } from "./llms.service";

@Controller("v1/llms")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class LlmsController {
  constructor(private readonly llmsService: LlmsService) {}

  @Get()
  state() {
    return this.llmsService.getAdminState();
  }

  @Post("generate")
  generate(@Body("publish") publish?: boolean) {
    return this.llmsService.generate({ publish: Boolean(publish) });
  }
}

@Controller()
export class PublicLlmsController {
  constructor(private readonly llmsService: LlmsService) {}

  @Get("llms.txt")
  @Header("Content-Type", "text/plain; charset=utf-8")
  llmsTxt() {
    return this.llmsService.getPublicText("llms");
  }

  @Get("llms-full.txt")
  @Header("Content-Type", "text/plain; charset=utf-8")
  llmsFullTxt() {
    return this.llmsService.getPublicText("llms-full");
  }
}
