import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TemplePilgrimTipQueryDto extends BaseQueryDto {}

export class CreateTemplePilgrimTipDto {
  @ApiProperty()
  @IsString()
  tip: string;

  @ApiPropertyOptional({ enum: Language, default: Language.hi })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateTemplePilgrimTipDto extends PartialType(CreateTemplePilgrimTipDto) {}

export class TemplePilgrimTipResponseDto extends CreateTemplePilgrimTipDto {
  @ApiProperty()
  id: string;
}
