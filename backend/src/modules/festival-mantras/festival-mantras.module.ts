import { Module } from "@nestjs/common";
import { FestivalMantrasController } from "./festival-mantras.controller";
import { FestivalMantrasService } from "./festival-mantras.service";

@Module({
  controllers: [FestivalMantrasController],
  providers: [FestivalMantrasService],
})
export class FestivalMantrasModule {}
