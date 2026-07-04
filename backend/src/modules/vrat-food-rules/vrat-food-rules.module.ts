import { Module } from "@nestjs/common";
import { VratFoodRulesController } from "./vrat-food-rules.controller";
import { VratFoodRulesService } from "./vrat-food-rules.service";

@Module({
  controllers: [VratFoodRulesController],
  providers: [VratFoodRulesService],
})
export class VratFoodRulesModule {}
