import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, Length, Matches, MaxLength } from "class-validator";
import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";

export class VerifyOtpDto {
  @ApiProperty({ example: "+919876543210" })
  @Matches(/^\+?[0-9]{7,20}$/)
  @MaxLength(20)
  mobile!: string;

  @ApiProperty({ example: "123456" })
  @Length(6, 6)
  @Matches(/^[0-9]{6}$/)
  otp!: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}
