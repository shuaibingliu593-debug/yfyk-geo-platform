import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AdminDashboardModule } from "./modules/admin-dashboard/admin-dashboard.module";
import { CasesModule } from "./modules/cases/cases.module";
import { FaqsModule } from "./modules/faqs/faqs.module";
import { GeoModule } from "./modules/geo/geo.module";
import { LlmsModule } from "./modules/llms/llms.module";
import { NewsModule } from "./modules/news/news.module";
import { PublicApiModule } from "./modules/public-api/public-api.module";
import { SitemapModule } from "./modules/sitemap/sitemap.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { StaticResourcesModule } from "./modules/static-resources/static-resources.module";
import { LeadsModule } from "./modules/leads/leads.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HealthModule,
    AdminDashboardModule,
    AuditModule,
    CasesModule,
    FaqsModule,
    NewsModule,
    PublicApiModule,
    SettingsModule,
    StaticResourcesModule,
    GeoModule,
    LlmsModule,
    SitemapModule,
    LeadsModule
  ]
})
export class AppModule {}
