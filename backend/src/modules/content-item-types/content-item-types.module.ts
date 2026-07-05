import { Module } from "@nestjs/common";
import { ContentItemTypesController } from "./content-item-types.controller";
import { ContentItemTypesService } from "./content-item-types.service";

@Module({
  controllers: [ContentItemTypesController],
  providers: [ContentItemTypesService],
})
export class ContentItemTypesModule {}
