import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { SettingsModule } from "../settings/settings.module";
import { PublicSitemapController, SitemapController } from "./sitemap.controller";
import { SitemapService } from "./sitemap.service";

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [SitemapController, PublicSitemapController],
  providers: [SitemapService]
})
export class SitemapModule {}
