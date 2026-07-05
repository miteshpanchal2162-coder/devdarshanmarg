import { Module } from "@nestjs/common";
import { ContentGalleriesController } from "./content-galleries.controller";
import { ContentGalleriesService } from "./content-galleries.service";

@Module({
  controllers: [ContentGalleriesController],
  providers: [ContentGalleriesService],
})
export class ContentGalleriesModule {}
