import { Module } from "@nestjs/common";
import { DeityAartisController } from "./deity-aartis.controller";
import { DeityAartisService } from "./deity-aartis.service";

@Module({
  controllers: [DeityAartisController],
  providers: [DeityAartisService],
})
export class DeityAartisModule {}
