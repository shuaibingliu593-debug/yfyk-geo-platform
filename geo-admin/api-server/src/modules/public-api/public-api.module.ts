import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { SettingsModule } from "../settings/settings.module";
import { PublicApiController } from "./public-api.controller";
import { PublicApiService } from "./public-api.service";

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [PublicApiController],
  providers: [PublicApiService],
  exports: [PublicApiService]
})
export class PublicApiModule {}
