import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class PanchangSunTimeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangId: string;

  @ApiPropertyOptional()
  sunrise: Date | null;

  @ApiPropertyOptional()
  sunset: Date | null;

  @ApiPropertyOptional()
  moonrise: Date | null;

  @ApiPropertyOptional()
  moonset: Date | null;

  @ApiProperty()
  updatedAt: Date;
}

export class UpdatePanchangSunTimeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  sunrise?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  sunset?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  moonrise?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  moonset?: string;
}

export class CreatePanchangSunTimeDto extends UpdatePanchangSunTimeDto {}
