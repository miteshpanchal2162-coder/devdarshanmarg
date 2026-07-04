import { Module } from "@nestjs/common";
import { FestivalCategoryMapsController } from "./festival-category-maps.controller";
import { FestivalCategoryMapsService } from "./festival-category-maps.service";

@Module({
  controllers: [FestivalCategoryMapsController],
  providers: [FestivalCategoryMapsService],
})
export class FestivalCategoryMapsModule {}
