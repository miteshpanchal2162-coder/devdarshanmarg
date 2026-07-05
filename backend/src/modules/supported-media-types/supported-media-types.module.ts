import { Module } from "@nestjs/common";
import { SupportedMediaTypesController } from "./supported-media-types.controller";
import { SupportedMediaTypesService } from "./supported-media-types.service";

@Module({
  controllers: [SupportedMediaTypesController],
  providers: [SupportedMediaTypesService],
})
export class SupportedMediaTypesModule {}
