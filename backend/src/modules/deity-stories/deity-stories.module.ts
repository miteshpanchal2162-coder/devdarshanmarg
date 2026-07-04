import { Module } from "@nestjs/common";
import { DeityStoriesController } from "./deity-stories.controller";
import { DeityStoriesService } from "./deity-stories.service";

@Module({
  controllers: [DeityStoriesController],
  providers: [DeityStoriesService],
})
export class DeityStoriesModule {}
