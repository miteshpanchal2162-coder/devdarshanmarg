import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TemplePoojaQueryDto extends BaseQueryDto {}

export class CreateTemplePoojaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  languageId?: string;

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
  poojaCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  durationMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  advanceBooking?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  onlineBooking?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  availableDaily?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  prasadIncluded?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  refundAllowed?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maxBookingsPerDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchKeywords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;

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

export class UpdateTemplePoojaDto extends PartialType(CreateTemplePoojaDto) {}

export class UpdateTemplePoojaStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TemplePoojaResponseDto extends CreateTemplePoojaDto {
  @ApiProperty()
  id: string;
}
