import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleTimingQueryDto extends BaseQueryDto {}

export class CreateTempleTimingDto {
  @ApiProperty({ minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  @Type(() => Number)
  dayOfWeek: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  openingTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  closingTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  breakStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  breakEndTime?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFestivalTiming?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialNote?: string;

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

export class UpdateTempleTimingDto extends PartialType(CreateTempleTimingDto) {}

export class UpdateTempleTimingStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleTimingResponseDto extends CreateTempleTimingDto {
  @ApiProperty()
  id: string;
}
