import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleTranslationQueryDto extends BaseQueryDto {}

export class CreateTempleTranslationDto {
  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;

  @ApiProperty()
  @IsString()
  name: string;

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
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaKeywords?: string;
}

export class UpdateTempleTranslationDto extends PartialType(CreateTempleTranslationDto) {}

export class TempleTranslationResponseDto extends CreateTempleTranslationDto {
  @ApiProperty()
  id: string;
}
