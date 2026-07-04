import { Module } from "@nestjs/common";
import { TithisController } from "./tithis.controller";
import { TithisService } from "./tithis.service";

@Module({
  controllers: [TithisController],
  providers: [TithisService],
})
export class TithisModule {}
