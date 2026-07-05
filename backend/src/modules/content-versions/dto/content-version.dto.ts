import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentVersionQueryDto extends BaseQueryDto {}

export class CreateContentVersionDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  versionNumber: number;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changeSummary?: string;
}

export class UpdateContentVersionDto extends PartialType(CreateContentVersionDto) {}

export class ContentVersionResponseDto extends CreateContentVersionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiPropertyOptional()
  createdBy: string | null;

  @ApiProperty()
  createdAt: Date;
}
