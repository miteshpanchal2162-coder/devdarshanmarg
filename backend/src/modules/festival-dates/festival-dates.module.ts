import { Module } from "@nestjs/common";
import { FestivalDatesController } from "./festival-dates.controller";
import { FestivalDatesService } from "./festival-dates.service";

@Module({
  controllers: [FestivalDatesController],
  providers: [FestivalDatesService],
})
export class FestivalDatesModule {}
