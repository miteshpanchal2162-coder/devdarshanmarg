import { Module } from "@nestjs/common";
import { FestivalFoodsController } from "./festival-foods.controller";
import { FestivalFoodsService } from "./festival-foods.service";

@Module({
  controllers: [FestivalFoodsController],
  providers: [FestivalFoodsService],
})
export class FestivalFoodsModule {}
