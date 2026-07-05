import { Module } from "@nestjs/common";
import { ContentCategoriesController } from "./content-categories.controller";
import { ContentCategoriesService } from "./content-categories.service";

@Module({
  controllers: [ContentCategoriesController],
  providers: [ContentCategoriesService],
})
export class ContentCategoriesModule {}
