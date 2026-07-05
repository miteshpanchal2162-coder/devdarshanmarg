import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, Matches, MaxLength } from "class-validator";
import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";

export class SendOtpDto {
  @ApiProperty({ example: "+919876543210" })
  @Matches(/^\+?[0-9]{7,20}$/)
  @MaxLength(20)
  mobile!: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}
