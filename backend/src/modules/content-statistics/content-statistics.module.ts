import { Module } from "@nestjs/common";
import { ContentStatisticsController } from "./content-statistics.controller";
import { ContentStatisticsService } from "./content-statistics.service";

@Module({
  controllers: [ContentStatisticsController],
  providers: [ContentStatisticsService],
})
export class ContentStatisticsModule {}
