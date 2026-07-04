import { Module } from "@nestjs/common";
import { FestivalCategoriesController } from "./festival-categories.controller";
import { FestivalCategoriesService } from "./festival-categories.service";

@Module({
  controllers: [FestivalCategoriesController],
  providers: [FestivalCategoriesService],
})
export class FestivalCategoriesModule {}
