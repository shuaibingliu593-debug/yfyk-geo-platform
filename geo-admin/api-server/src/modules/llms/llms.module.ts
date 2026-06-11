import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { SettingsModule } from "../settings/settings.module";
import { LlmsController, PublicLlmsController } from "./llms.controller";
import { LlmsService } from "./llms.service";

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [LlmsController, PublicLlmsController],
  providers: [LlmsService]
})
export class LlmsModule {}
