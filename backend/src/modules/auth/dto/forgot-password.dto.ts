import { ApiProperty } from "@nestjs/swagger";
import { Matches, MaxLength } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "+919876543210" })
  @Matches(/^\+?[0-9]{7,20}$/)
  @MaxLength(20)
  mobile!: string;
}
