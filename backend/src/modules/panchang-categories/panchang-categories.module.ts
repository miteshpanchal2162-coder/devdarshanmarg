import { Module } from "@nestjs/common";
import { PanchangCategoriesController } from "./panchang-categories.controller";
import { PanchangCategoriesService } from "./panchang-categories.service";

@Module({
  controllers: [PanchangCategoriesController],
  providers: [PanchangCategoriesService],
})
export class PanchangCategoriesModule {}
