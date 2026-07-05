import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OtpVerificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true })
  mobile: string | null;

  @ApiPropertyOptional({ nullable: true })
  email: string | null;

  @ApiProperty()
  purpose: string;

  @ApiProperty()
  expireTime: Date;

  @ApiPropertyOptional({ nullable: true })
  verifiedTime: Date | null;

  @ApiProperty()
  retryCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
