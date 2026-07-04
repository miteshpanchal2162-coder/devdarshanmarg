import { Module } from "@nestjs/common";
import { PlanetsController } from "./planets.controller";
import { PlanetsService } from "./planets.service";

@Module({
  controllers: [PlanetsController],
  providers: [PlanetsService],
})
export class PlanetsModule {}
