import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class PanchangPlanetPositionQueryDto extends BaseQueryDto {}

export class CreatePanchangPlanetPositionDto {
  @ApiProperty()
  @IsUUID()
  planetId: string;

  @ApiProperty()
  @IsUUID()
  rashiId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  degree?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isRetrograde?: boolean;
}

export class UpdatePanchangPlanetPositionDto extends PartialType(CreatePanchangPlanetPositionDto) {}

export class PanchangPlanetPositionResponseDto extends CreatePanchangPlanetPositionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
