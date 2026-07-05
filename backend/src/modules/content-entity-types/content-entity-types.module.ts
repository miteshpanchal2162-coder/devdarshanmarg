import { Module } from "@nestjs/common";
import { ContentEntityTypesController } from "./content-entity-types.controller";
import { ContentEntityTypesService } from "./content-entity-types.service";

@Module({
  controllers: [ContentEntityTypesController],
  providers: [ContentEntityTypesService],
})
export class ContentEntityTypesModule {}
