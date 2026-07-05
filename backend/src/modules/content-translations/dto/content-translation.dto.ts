import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentTranslationQueryDto extends BaseQueryDto {}

export class CreateContentTranslationDto {
  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;
}

export class UpdateContentTranslationDto extends PartialType(CreateContentTranslationDto) {}

export class ContentTranslationResponseDto extends CreateContentTranslationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
