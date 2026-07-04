import { Module } from "@nestjs/common";
import { FestivalTranslationsController } from "./festival-translations.controller";
import { FestivalTranslationsService } from "./festival-translations.service";

@Module({
  controllers: [FestivalTranslationsController],
  providers: [FestivalTranslationsService],
})
export class FestivalTranslationsModule {}
