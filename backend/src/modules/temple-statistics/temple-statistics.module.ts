import { Module } from "@nestjs/common";
import { TempleStatisticsController } from "./temple-statistics.controller";
import { TempleStatisticsService } from "./temple-statistics.service";

@Module({
  controllers: [TempleStatisticsController],
  providers: [TempleStatisticsService],
})
export class TempleStatisticsModule {}
