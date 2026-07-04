import { Module } from "@nestjs/common";
import { PanchangRegionsController } from "./panchang-regions.controller";
import { PanchangRegionsService } from "./panchang-regions.service";

@Module({
  controllers: [PanchangRegionsController],
  providers: [PanchangRegionsService],
})
export class PanchangRegionsModule {}
