import { Module } from "@nestjs/common";
import { FestivalKathasController } from "./festival-kathas.controller";
import { FestivalKathasService } from "./festival-kathas.service";

@Module({
  controllers: [FestivalKathasController],
  providers: [FestivalKathasService],
})
export class FestivalKathasModule {}
