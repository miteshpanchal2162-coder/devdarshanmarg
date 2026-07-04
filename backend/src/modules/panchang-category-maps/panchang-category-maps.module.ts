import { Module } from "@nestjs/common";
import { PanchangCategoryMapsController } from "./panchang-category-maps.controller";
import { PanchangCategoryMapsService } from "./panchang-category-maps.service";

@Module({
  controllers: [PanchangCategoryMapsController],
  providers: [PanchangCategoryMapsService],
})
export class PanchangCategoryMapsModule {}
