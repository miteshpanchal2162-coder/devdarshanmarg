import { Module } from "@nestjs/common";
import { FestivalVideosController } from "./festival-videos.controller";
import { FestivalVideosService } from "./festival-videos.service";

@Module({
  controllers: [FestivalVideosController],
  providers: [FestivalVideosService],
})
export class FestivalVideosModule {}
