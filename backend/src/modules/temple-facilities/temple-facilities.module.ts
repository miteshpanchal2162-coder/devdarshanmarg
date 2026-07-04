import { Module } from "@nestjs/common";
import { TempleFacilitiesController } from "./temple-facilities.controller";
import { TempleFacilitiesService } from "./temple-facilities.service";

@Module({
  controllers: [TempleFacilitiesController],
  providers: [TempleFacilitiesService],
})
export class TempleFacilitiesModule {}
