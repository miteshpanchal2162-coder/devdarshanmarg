import { Module } from "@nestjs/common";
import { FestivalPujaVidhisController } from "./festival-puja-vidhis.controller";
import { FestivalPujaVidhisService } from "./festival-puja-vidhis.service";

@Module({
  controllers: [FestivalPujaVidhisController],
  providers: [FestivalPujaVidhisService],
})
export class FestivalPujaVidhisModule {}
