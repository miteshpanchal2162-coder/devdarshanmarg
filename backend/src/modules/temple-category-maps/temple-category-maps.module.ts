import { Module } from "@nestjs/common";
import { TempleCategoryMapsController } from "./temple-category-maps.controller";
import { TempleCategoryMapsService } from "./temple-category-maps.service";

@Module({
  controllers: [TempleCategoryMapsController],
  providers: [TempleCategoryMapsService],
})
export class TempleCategoryMapsModule {}
