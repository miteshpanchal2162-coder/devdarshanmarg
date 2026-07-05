import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class SeoLandingPageQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isActive?: boolean;
}

export class CreateSeoLandingPageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional({ enum: Language, default: Language.en })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  title: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSeoLandingPageDto extends PartialType(CreateSeoLandingPageDto) {}

export class SeoLandingPageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: Language })
  language: Language;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  metaTitle: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  content: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
