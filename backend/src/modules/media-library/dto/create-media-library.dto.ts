import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MediaType } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateMediaLibraryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  originalName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  mimeType: string;

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  mediaType: MediaType;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  storagePath: string;

  @ApiPropertyOptional({ default: "local" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  storageType?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  fileSize: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  width?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  uploadedById?: string;
}
