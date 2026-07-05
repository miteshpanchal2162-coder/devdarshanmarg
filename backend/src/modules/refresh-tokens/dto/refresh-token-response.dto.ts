import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RefreshTokenRecordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiPropertyOptional({ nullable: true })
  revokedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  deviceInfo: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
