import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentItemTranslationQueryDto extends BaseQueryDto {}

export class CreateContentItemTranslationDto {
  @ApiProperty()
  @IsUUID()
  languageId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transliteration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meaning?: string;
}

export class UpdateContentItemTranslationDto extends PartialType(CreateContentItemTranslationDto) {}

export class ContentItemTranslationResponseDto extends CreateContentItemTranslationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
