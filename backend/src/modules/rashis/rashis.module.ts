import { Module } from "@nestjs/common";
import { RashisController } from "./rashis.controller";
import { RashisService } from "./rashis.service";

@Module({
  controllers: [RashisController],
  providers: [RashisService],
})
export class RashisModule {}
