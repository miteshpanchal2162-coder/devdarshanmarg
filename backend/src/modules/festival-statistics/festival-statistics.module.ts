import { Module } from "@nestjs/common";
import { FestivalStatisticsController } from "./festival-statistics.controller";
import { FestivalStatisticsService } from "./festival-statistics.service";

@Module({
  controllers: [FestivalStatisticsController],
  providers: [FestivalStatisticsService],
})
export class FestivalStatisticsModule {}
