import { Module } from "@nestjs/common";
import { TempleQrCodesController } from "./temple-qr-codes.controller";
import { TempleQrCodesService } from "./temple-qr-codes.service";

@Module({
  controllers: [TempleQrCodesController],
  providers: [TempleQrCodesService],
})
export class TempleQrCodesModule {}
