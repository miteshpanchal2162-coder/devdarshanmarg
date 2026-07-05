import { PartialType } from "@nestjs/swagger";
import { CreateOtpVerificationDto } from "./otp-verification.dto";

export class UpdateOtpVerificationDto extends PartialType(CreateOtpVerificationDto) {}
