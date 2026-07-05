import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentAttachmentQueryDto extends BaseQueryDto {}

export class CreateContentAttachmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  languageId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  attachmentCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  fileName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  fileUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fileType?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  fileSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  checksum?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDownloadable?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  downloadLimit?: number;

  @ApiPropertyOptional()
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

export class UpdateContentAttachmentDto extends PartialType(CreateContentAttachmentDto) {}

export class UpdateContentAttachmentStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class ContentAttachmentResponseDto extends CreateContentAttachmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  downloadCount: number;
}
