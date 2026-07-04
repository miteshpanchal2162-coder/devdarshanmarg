import { Module } from "@nestjs/common";
import { DeityCategoriesController } from "./deity-categories.controller";
import { DeityCategoriesService } from "./deity-categories.service";

@Module({
  controllers: [DeityCategoriesController],
  providers: [DeityCategoriesService],
})
export class DeityCategoriesModule {}
