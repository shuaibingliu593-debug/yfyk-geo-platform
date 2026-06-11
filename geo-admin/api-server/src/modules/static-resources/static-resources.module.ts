import { Module } from "@nestjs/common";
import { PublicStaticResourcesController } from "./public-static-resources.controller";
import { StaticResourcesController } from "./static-resources.controller";
import { StaticResourcesService } from "./static-resources.service";

@Module({
  controllers: [StaticResourcesController, PublicStaticResourcesController],
  providers: [StaticResourcesService]
})
export class StaticResourcesModule {}
