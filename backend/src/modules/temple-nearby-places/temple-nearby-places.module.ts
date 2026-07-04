import { Module } from "@nestjs/common";
import { TempleNearbyPlacesController } from "./temple-nearby-places.controller";
import { TempleNearbyPlacesService } from "./temple-nearby-places.service";

@Module({
  controllers: [TempleNearbyPlacesController],
  providers: [TempleNearbyPlacesService],
})
export class TempleNearbyPlacesModule {}
