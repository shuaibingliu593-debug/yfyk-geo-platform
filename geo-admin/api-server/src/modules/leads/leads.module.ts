import { Module } from "@nestjs/common";
import { PublicApiModule } from "../public-api/public-api.module";
import { LeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";
import { PublicLeadsController } from "./public-leads.controller";

@Module({
  imports: [PublicApiModule],
  controllers: [LeadsController, PublicLeadsController],
  providers: [LeadsService],
  exports: [LeadsService]
})
export class LeadsModule {}
