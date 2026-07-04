import { Module } from "@nestjs/common";
import { FestivalGalleryController } from "./festival-gallery.controller";
import { FestivalGalleryService } from "./festival-gallery.service";

@Module({
  controllers: [FestivalGalleryController],
  providers: [FestivalGalleryService],
})
export class FestivalGalleryModule {}
