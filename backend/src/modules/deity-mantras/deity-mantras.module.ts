import { Module } from "@nestjs/common";
import { DeityMantrasController } from "./deity-mantras.controller";
import { DeityMantrasService } from "./deity-mantras.service";

@Module({
  controllers: [DeityMantrasController],
  providers: [DeityMantrasService],
})
export class DeityMantrasModule {}
