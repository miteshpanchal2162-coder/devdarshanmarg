import { Module } from "@nestjs/common";
import { DeityFestivalsController } from "./deity-festivals.controller";
import { DeityFestivalsService } from "./deity-festivals.service";

@Module({
  controllers: [DeityFestivalsController],
  providers: [DeityFestivalsService],
})
export class DeityFestivalsModule {}
