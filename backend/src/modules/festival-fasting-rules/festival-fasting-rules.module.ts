import { Module } from "@nestjs/common";
import { FestivalFastingRulesController } from "./festival-fasting-rules.controller";
import { FestivalFastingRulesService } from "./festival-fasting-rules.service";

@Module({
  controllers: [FestivalFastingRulesController],
  providers: [FestivalFastingRulesService],
})
export class FestivalFastingRulesModule {}
