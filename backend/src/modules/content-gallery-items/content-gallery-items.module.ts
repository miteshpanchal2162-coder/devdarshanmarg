import { Module } from "@nestjs/common";
import { ContentGalleryItemsController } from "./content-gallery-items.controller";
import { ContentGalleryItemsService } from "./content-gallery-items.service";

@Module({
  controllers: [ContentGalleryItemsController],
  providers: [ContentGalleryItemsService],
})
export class ContentGalleryItemsModule {}
