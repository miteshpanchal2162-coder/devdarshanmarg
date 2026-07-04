import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleCategoryMapQueryDto extends BaseQueryDto {}

export class CreateTempleCategoryMapDto {
  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateTempleCategoryMapDto extends PartialType(CreateTempleCategoryMapDto) {}

export class TempleCategoryMapResponseDto extends CreateTempleCategoryMapDto {
  @ApiProperty()
  id: string;
}
