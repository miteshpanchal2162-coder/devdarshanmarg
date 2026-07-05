import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({ description: "OTP code submitted for verification" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  otp: string;
}
