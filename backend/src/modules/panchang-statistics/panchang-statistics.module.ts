import { Module } from "@nestjs/common";
import { PanchangStatisticsController } from "./panchang-statistics.controller";
import { PanchangStatisticsService } from "./panchang-statistics.service";

@Module({
  controllers: [PanchangStatisticsController],
  providers: [PanchangStatisticsService],
})
export class PanchangStatisticsModule {}
