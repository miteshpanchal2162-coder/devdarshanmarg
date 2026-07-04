import { Module } from "@nestjs/common";
import { FestivalRitualsController } from "./festival-rituals.controller";
import { FestivalRitualsService } from "./festival-rituals.service";

@Module({
  controllers: [FestivalRitualsController],
  providers: [FestivalRitualsService],
})
export class FestivalRitualsModule {}
