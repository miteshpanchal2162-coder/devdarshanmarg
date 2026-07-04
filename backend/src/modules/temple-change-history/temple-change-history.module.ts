import { Module } from "@nestjs/common";
import { TempleChangeHistoryController } from "./temple-change-history.controller";
import { TempleChangeHistoryService } from "./temple-change-history.service";

@Module({
  controllers: [TempleChangeHistoryController],
  providers: [TempleChangeHistoryService],
})
export class TempleChangeHistoryModule {}
