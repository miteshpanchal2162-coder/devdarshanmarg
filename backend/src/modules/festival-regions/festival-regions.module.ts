import { Module } from "@nestjs/common";
import { FestivalRegionsController } from "./festival-regions.controller";
import { FestivalRegionsService } from "./festival-regions.service";

@Module({
  controllers: [FestivalRegionsController],
  providers: [FestivalRegionsService],
})
export class FestivalRegionsModule {}
