import { Module } from "@nestjs/common";
import { SupportedLanguagesController } from "./supported-languages.controller";
import { SupportedLanguagesService } from "./supported-languages.service";

@Module({
  controllers: [SupportedLanguagesController],
  providers: [SupportedLanguagesService],
})
export class SupportedLanguagesModule {}
