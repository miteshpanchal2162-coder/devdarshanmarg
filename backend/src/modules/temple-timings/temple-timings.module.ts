import { Module } from "@nestjs/common";
import { TempleTimingsController } from "./temple-timings.controller";
import { TempleTimingsService } from "./temple-timings.service";

@Module({
  controllers: [TempleTimingsController],
  providers: [TempleTimingsService],
})
export class TempleTimingsModule {}
