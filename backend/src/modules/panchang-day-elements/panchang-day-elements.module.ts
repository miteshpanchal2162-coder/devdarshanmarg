import { Module } from "@nestjs/common";
import { PanchangDayElementsController } from "./panchang-day-elements.controller";
import { PanchangDayElementsService } from "./panchang-day-elements.service";

@Module({
  controllers: [PanchangDayElementsController],
  providers: [PanchangDayElementsService],
})
export class PanchangDayElementsModule {}
