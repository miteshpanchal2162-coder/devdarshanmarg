import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentEntityMapQueryDto extends BaseQueryDto {}

export class CreateContentEntityMapDto {
  @ApiProperty()
  @IsUUID()
  entityTypeId: string;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  displayTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayDescription?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

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

export class UpdateContentEntityMapDto extends PartialType(CreateContentEntityMapDto) {}

export class UpdateContentEntityMapStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class ContentEntityMapResponseDto extends CreateContentEntityMapDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiPropertyOptional()
  createdBy: string | null;

  @ApiPropertyOptional()
  updatedBy: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
