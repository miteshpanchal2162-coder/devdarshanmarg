import { Module } from "@nestjs/common";
import { DeityBlessingsController } from "./deity-blessings.controller";
import { DeityBlessingsService } from "./deity-blessings.service";

@Module({
  controllers: [DeityBlessingsController],
  providers: [DeityBlessingsService],
})
export class DeityBlessingsModule {}
