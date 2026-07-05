import { Module } from "@nestjs/common";
import { FestivalTempleMapsController } from "./festival-temple-maps.controller";
import { FestivalTempleMapsService } from "./festival-temple-maps.service";

@Module({
  controllers: [FestivalTempleMapsController],
  providers: [FestivalTempleMapsService],
})
export class FestivalTempleMapsModule {}
