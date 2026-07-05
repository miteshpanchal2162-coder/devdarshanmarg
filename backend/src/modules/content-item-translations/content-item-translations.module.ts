import { Module } from "@nestjs/common";
import { ContentItemTranslationsController } from "./content-item-translations.controller";
import { ContentItemTranslationsService } from "./content-item-translations.service";

@Module({
  controllers: [ContentItemTranslationsController],
  providers: [ContentItemTranslationsService],
})
export class ContentItemTranslationsModule {}
