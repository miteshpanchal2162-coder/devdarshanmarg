import { Module } from "@nestjs/common";
import { DeityCategoryMapsController } from "./deity-category-maps.controller";
import { DeityCategoryMapsService } from "./deity-category-maps.service";

@Module({
  controllers: [DeityCategoryMapsController],
  providers: [DeityCategoryMapsService],
})
export class DeityCategoryMapsModule {}
