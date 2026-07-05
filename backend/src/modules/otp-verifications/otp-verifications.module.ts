import { Module } from "@nestjs/common";
import { OtpVerificationsController } from "./otp-verifications.controller";
import { OtpVerificationsService } from "./otp-verifications.service";

@Module({
  controllers: [OtpVerificationsController],
  providers: [OtpVerificationsService],
  exports: [OtpVerificationsService],
})
export class OtpVerificationsModule {}
