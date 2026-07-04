import { Module } from "@nestjs/common";
import { TempleDeityMapsController } from "./temple-deity-maps.controller";
import { TempleDeityMapsService } from "./temple-deity-maps.service";

@Module({
  controllers: [TempleDeityMapsController],
  providers: [TempleDeityMapsService],
})
export class TempleDeityMapsModule {}
