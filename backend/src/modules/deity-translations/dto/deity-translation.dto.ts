import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityTranslationQueryDto extends BaseQueryDto {}

export class CreateDeityTranslationDto {
  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

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

export class UpdateDeityTranslationDto extends PartialType(CreateDeityTranslationDto) {}

export class DeityTranslationResponseDto extends CreateDeityTranslationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
