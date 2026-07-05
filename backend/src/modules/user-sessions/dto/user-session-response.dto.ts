import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ nullable: true })
  deviceName: string | null;

  @ApiPropertyOptional({ nullable: true })
  deviceType: string | null;

  @ApiPropertyOptional({ nullable: true })
  browser: string | null;

  @ApiPropertyOptional({ nullable: true })
  os: string | null;

  @ApiPropertyOptional({ nullable: true })
  ipAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  userAgent: string | null;

  @ApiProperty()
  loginTime: Date;

  @ApiProperty()
  lastActivity: Date;

  @ApiPropertyOptional({ nullable: true })
  logoutTime: Date | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
