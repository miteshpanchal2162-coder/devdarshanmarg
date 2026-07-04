import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleFacilityQueryDto extends BaseQueryDto {}

export class CreateTempleFacilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facilityCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  available24Hours?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  openingTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closingTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateTempleFacilityDto extends PartialType(CreateTempleFacilityDto) {}

export class UpdateTempleFacilityStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleFacilityResponseDto extends CreateTempleFacilityDto {
  @ApiProperty()
  id: string;
}
