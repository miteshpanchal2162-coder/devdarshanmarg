import { Module } from "@nestjs/common";
import { TempleAartisController } from "./temple-aartis.controller";
import { TempleAartisService } from "./temple-aartis.service";

@Module({
  controllers: [TempleAartisController],
  providers: [TempleAartisService],
})
export class TempleAartisModule {}
