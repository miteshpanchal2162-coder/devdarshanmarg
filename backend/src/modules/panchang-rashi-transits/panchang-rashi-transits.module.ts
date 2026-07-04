import { Module } from "@nestjs/common";
import { PanchangRashiTransitsController } from "./panchang-rashi-transits.controller";
import { PanchangRashiTransitsService } from "./panchang-rashi-transits.service";

@Module({
  controllers: [PanchangRashiTransitsController],
  providers: [PanchangRashiTransitsService],
})
export class PanchangRashiTransitsModule {}
