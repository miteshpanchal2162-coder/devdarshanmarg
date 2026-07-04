import { Module } from "@nestjs/common";
import { DeityTranslationsController } from "./deity-translations.controller";
import { DeityTranslationsService } from "./deity-translations.service";

@Module({
  controllers: [DeityTranslationsController],
  providers: [DeityTranslationsService],
})
export class DeityTranslationsModule {}
