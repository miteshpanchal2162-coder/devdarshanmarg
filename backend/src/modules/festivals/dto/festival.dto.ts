import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class FestivalQueryDto extends BaseQueryDto {}

export class CreateFestivalDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  festivalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alternateNames?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchKeywords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  festivalType?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  importanceLevel?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isNational?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRegional?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isInternational?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublicHoliday?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  heroImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bannerImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

export class UpdateFestivalDto extends PartialType(CreateFestivalDto) {}

export class UpdateFestivalStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class FestivalResponseDto extends CreateFestivalDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdBy: string | null;

  @ApiPropertyOptional()
  updatedBy: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
