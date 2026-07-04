import { Module } from "@nestjs/common";
import { TempleTranslationsController } from "./temple-translations.controller";
import { TempleTranslationsService } from "./temple-translations.service";

@Module({
  controllers: [TempleTranslationsController],
  providers: [TempleTranslationsService],
})
export class TempleTranslationsModule {}
