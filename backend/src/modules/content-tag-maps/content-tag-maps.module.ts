import { Module } from "@nestjs/common";
import { ContentTagMapsController } from "./content-tag-maps.controller";
import { ContentTagMapsService } from "./content-tag-maps.service";

@Module({
  controllers: [ContentTagMapsController],
  providers: [ContentTagMapsService],
})
export class ContentTagMapsModule {}
