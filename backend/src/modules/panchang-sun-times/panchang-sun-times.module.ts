import { Module } from "@nestjs/common";
import { PanchangSunTimesController } from "./panchang-sun-times.controller";
import { PanchangSunTimesService } from "./panchang-sun-times.service";

@Module({
  controllers: [PanchangSunTimesController],
  providers: [PanchangSunTimesService],
})
export class PanchangSunTimesModule {}
