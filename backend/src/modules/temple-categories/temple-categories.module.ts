import { Module } from "@nestjs/common";
import { TempleCategoriesController } from "./temple-categories.controller";
import { TempleCategoriesService } from "./temple-categories.service";

@Module({
  controllers: [TempleCategoriesController],
  providers: [TempleCategoriesService],
})
export class TempleCategoriesModule {}
