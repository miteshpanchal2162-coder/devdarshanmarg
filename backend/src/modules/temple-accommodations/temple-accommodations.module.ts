import { Module } from "@nestjs/common";
import { TempleAccommodationsController } from "./temple-accommodations.controller";
import { TempleAccommodationsService } from "./temple-accommodations.service";

@Module({
  controllers: [TempleAccommodationsController],
  providers: [TempleAccommodationsService],
})
export class TempleAccommodationsModule {}
