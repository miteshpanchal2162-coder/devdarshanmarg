import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class SeoRedirectQueryDto extends BaseQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class CreateSeoRedirectDto {
  @ApiProperty()
  @IsString()
  @MaxLength(500)
  fromPath: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  toPath: string;

  @ApiPropertyOptional({ default: 301 })
  @IsInt()
  @IsOptional()
  @Min(100)
  @Type(() => Number)
  statusCode?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSeoRedirectDto extends PartialType(CreateSeoRedirectDto) {}

export class SeoRedirectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fromPath: string;

  @ApiProperty()
  toPath: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
