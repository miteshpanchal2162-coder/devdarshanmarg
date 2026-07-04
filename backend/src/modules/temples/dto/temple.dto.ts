import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleQueryDto extends BaseQueryDto {}

export class CreateTempleDto {
  @ApiProperty()
  @IsUUID()
  countryId: string;

  @ApiProperty()
  @IsUUID()
  stateId: string;

  @ApiProperty()
  @IsUUID()
  cityId: string;

  @ApiProperty()
  @IsUUID()
  areaId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  templeCode?: string;

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
  @MaxLength(255)
  canonicalName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  shortName?: string;

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
  history?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  significance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  architecture?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alternateNames?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  famousFor?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  foundedYear?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  establishedDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastRenovatedDate?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  openingYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closingRemarks?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  googleMapUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  virtualTourUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  youtubeVideoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  officialWebsite?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine1?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  landmark?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dressCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bestTimeToVisit?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  estimatedVisitTime?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  entryFee?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  parkingAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  wheelchairAccessible?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  photographyAllowed?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  mobileAllowed?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  prasadamAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  accommodationAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  lockerAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  shoeStandAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  drinkingWaterAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  toiletAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  popular?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  viewCount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  favoriteCount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  shareCount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ratingAverage?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  ratingCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchKeywords?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  searchPriority?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isSearchable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImage?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  schemaGenerated?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

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

export class UpdateTempleDto extends PartialType(CreateTempleDto) {}

export class UpdateTempleStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleResponseDto extends CreateTempleDto {
  @ApiProperty()
  id: string;
}
