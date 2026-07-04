import { Module } from "@nestjs/common";
import { PanchangTranslationsController } from "./panchang-translations.controller";
import { PanchangTranslationsService } from "./panchang-translations.service";

@Module({
  controllers: [PanchangTranslationsController],
  providers: [PanchangTranslationsService],
})
export class PanchangTranslationsModule {}
