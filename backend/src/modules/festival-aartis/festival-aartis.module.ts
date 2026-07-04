import { Module } from "@nestjs/common";
import { FestivalAartisController } from "./festival-aartis.controller";
import { FestivalAartisService } from "./festival-aartis.service";

@Module({
  controllers: [FestivalAartisController],
  providers: [FestivalAartisService],
})
export class FestivalAartisModule {}
