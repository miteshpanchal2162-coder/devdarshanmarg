import { Module } from "@nestjs/common";
import { ContentEntityMapsController } from "./content-entity-maps.controller";
import { ContentEntityMapsService } from "./content-entity-maps.service";

@Module({
  controllers: [ContentEntityMapsController],
  providers: [ContentEntityMapsService],
})
export class ContentEntityMapsModule {}
