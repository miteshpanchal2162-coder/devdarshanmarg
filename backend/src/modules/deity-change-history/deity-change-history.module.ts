import { Module } from "@nestjs/common";
import { DeityChangeHistoryController } from "./deity-change-history.controller";
import { DeityChangeHistoryService } from "./deity-change-history.service";

@Module({
  controllers: [DeityChangeHistoryController],
  providers: [DeityChangeHistoryService],
})
export class DeityChangeHistoryModule {}
