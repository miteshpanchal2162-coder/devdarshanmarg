import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class CreatePanchangDayElementDto {
  @ApiProperty()
  @IsUUID()
  tithiId: string;

  @ApiProperty()
  @IsUUID()
  nakshatraId: string;

  @ApiProperty()
  @IsUUID()
  yogaId: string;

  @ApiProperty()
  @IsUUID()
  karanaId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  tithiStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  tithiEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nakshatraStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nakshatraEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  yogaStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  yogaEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  karanaStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  karanaEnd?: string;
}

export class UpdatePanchangDayElementDto extends PartialType(CreatePanchangDayElementDto) {}

export class PanchangDayElementResponseDto extends CreatePanchangDayElementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
