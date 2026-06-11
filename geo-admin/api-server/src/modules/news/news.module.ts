import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { PublicNewsController } from "./public-news.controller";

@Module({
  controllers: [NewsController, PublicNewsController],
  providers: [NewsService]
})
export class NewsModule {}
