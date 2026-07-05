import { Module } from "@nestjs/common";
import { PanchangDatesController } from "./panchang-dates.controller";
import { PanchangDatesService } from "./panchang-dates.service";

@Module({
  controllers: [PanchangDatesController],
  providers: [PanchangDatesService],
  exports: [PanchangDatesService],
})
export class PanchangDatesModule {}
