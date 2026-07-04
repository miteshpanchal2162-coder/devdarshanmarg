import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleRouteQueryDto extends BaseQueryDto {}

export class CreateTempleRouteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startingPoint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  distanceKm?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  estimatedTimeMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transportMode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bestSeason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roadCondition?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  googleMapUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

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

export class UpdateTempleRouteDto extends PartialType(CreateTempleRouteDto) {}

export class UpdateTempleRouteStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleRouteResponseDto extends CreateTempleRouteDto {
  @ApiProperty()
  id: string;
}
