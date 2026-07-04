import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status, UserRole } from "@prisma/client";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  mobileVerified: boolean;

  @ApiPropertyOptional()
  profileImage: string | null;

  @ApiPropertyOptional()
  lastLoginAt: Date | null;

  @ApiPropertyOptional()
  createdBy: string | null;

  @ApiPropertyOptional()
  updatedBy: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
