import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ nullable: true })
  gender: string | null;

  @ApiPropertyOptional({ nullable: true })
  dateOfBirth: Date | null;

  @ApiPropertyOptional({ nullable: true })
  countryId: string | null;

  @ApiPropertyOptional({ nullable: true })
  stateId: string | null;

  @ApiPropertyOptional({ nullable: true })
  cityId: string | null;

  @ApiPropertyOptional({ nullable: true })
  areaId: string | null;

  @ApiPropertyOptional({ nullable: true })
  address: string | null;

  @ApiPropertyOptional({ nullable: true })
  postalCode: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatar: string | null;

  @ApiPropertyOptional({ nullable: true })
  bio: string | null;

  @ApiPropertyOptional({ nullable: true })
  languageId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
