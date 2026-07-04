import { Module } from "@nestjs/common";
import { DeityProfilesController } from "./deity-profiles.controller";
import { DeityProfilesService } from "./deity-profiles.service";

@Module({
  controllers: [DeityProfilesController],
  providers: [DeityProfilesService],
})
export class DeityProfilesModule {}
