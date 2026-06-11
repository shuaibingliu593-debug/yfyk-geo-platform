import { Module } from "@nestjs/common";
import { CasesController } from "./cases.controller";
import { CasesService } from "./cases.service";
import { PublicCasesController } from "./public-cases.controller";

@Module({
  controllers: [CasesController, PublicCasesController],
  providers: [CasesService]
})
export class CasesModule {}
