import { Module } from "@nestjs/common";
import { DeityTempleMapsController } from "./deity-temple-maps.controller";
import { DeityTempleMapsService } from "./deity-temple-maps.service";

@Module({
  controllers: [DeityTempleMapsController],
  providers: [DeityTempleMapsService],
})
export class DeityTempleMapsModule {}
