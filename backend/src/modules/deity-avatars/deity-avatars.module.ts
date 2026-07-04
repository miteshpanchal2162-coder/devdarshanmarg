import { Module } from "@nestjs/common";
import { DeityAvatarsController } from "./deity-avatars.controller";
import { DeityAvatarsService } from "./deity-avatars.service";

@Module({
  controllers: [DeityAvatarsController],
  providers: [DeityAvatarsService],
})
export class DeityAvatarsModule {}
