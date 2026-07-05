import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ContentStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentQueryDto extends BaseQueryDto {}

export class CreateContentDto {
  @ApiProperty()
  @IsUUID()
  contentTypeId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.draft })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}

export class UpdateContentDto extends PartialType(CreateContentDto) {}

export class UpdateContentStatusDto {
  @ApiProperty({ enum: ContentStatus })
  @IsEnum(ContentStatus)
  status: ContentStatus;
}

export class ContentResponseDto extends CreateContentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
