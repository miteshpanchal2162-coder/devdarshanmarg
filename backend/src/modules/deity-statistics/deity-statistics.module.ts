import { Module } from "@nestjs/common";
import { DeityStatisticsController } from "./deity-statistics.controller";
import { DeityStatisticsService } from "./deity-statistics.service";

@Module({
  controllers: [DeityStatisticsController],
  providers: [DeityStatisticsService],
})
export class DeityStatisticsModule {}
