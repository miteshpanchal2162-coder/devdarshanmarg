import { Module } from "@nestjs/common";
import { ContentRelatedItemsController } from "./content-related-items.controller";
import { ContentRelatedItemsService } from "./content-related-items.service";

@Module({
  controllers: [ContentRelatedItemsController],
  providers: [ContentRelatedItemsService],
})
export class ContentRelatedItemsModule {}
