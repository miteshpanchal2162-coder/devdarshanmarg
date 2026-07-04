import { Module } from "@nestjs/common";
import { PanchangPlanetPositionsController } from "./panchang-planet-positions.controller";
import { PanchangPlanetPositionsService } from "./panchang-planet-positions.service";

@Module({
  controllers: [PanchangPlanetPositionsController],
  providers: [PanchangPlanetPositionsService],
})
export class PanchangPlanetPositionsModule {}
