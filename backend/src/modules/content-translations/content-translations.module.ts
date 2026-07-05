import { Module } from "@nestjs/common";
import { ContentTranslationsController } from "./content-translations.controller";
import { ContentTranslationsService } from "./content-translations.service";

@Module({
  controllers: [ContentTranslationsController],
  providers: [ContentTranslationsService],
})
export class ContentTranslationsModule {}
