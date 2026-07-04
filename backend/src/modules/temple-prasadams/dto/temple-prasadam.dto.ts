import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TemplePrasadamQueryDto extends BaseQueryDto {}

export class CreateTemplePrasadamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prasadamCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  availableDaily?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  bookingRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  distributionTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shelfLife?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

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

export class UpdateTemplePrasadamDto extends PartialType(CreateTemplePrasadamDto) {}

export class UpdateTemplePrasadamStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TemplePrasadamResponseDto extends CreateTemplePrasadamDto {
  @ApiProperty()
  id: string;
}
