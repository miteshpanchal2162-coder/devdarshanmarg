import { Module } from "@nestjs/common";
import { PanchangChangeHistoryController } from "./panchang-change-history.controller";
import { PanchangChangeHistoryService } from "./panchang-change-history.service";

@Module({
  controllers: [PanchangChangeHistoryController],
  providers: [PanchangChangeHistoryService],
})
export class PanchangChangeHistoryModule {}
