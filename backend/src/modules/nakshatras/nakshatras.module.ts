import { Module } from "@nestjs/common";
import { NakshatrasController } from "./nakshatras.controller";
import { NakshatrasService } from "./nakshatras.service";

@Module({
  controllers: [NakshatrasController],
  providers: [NakshatrasService],
})
export class NakshatrasModule {}
