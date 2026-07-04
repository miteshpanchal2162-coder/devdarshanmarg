import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class PanchangCategoryMapQueryDto extends BaseQueryDto {}

export class CreatePanchangCategoryMapDto {
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

export class UpdatePanchangCategoryMapDto extends PartialType(CreatePanchangCategoryMapDto) {}

export class PanchangCategoryMapResponseDto extends CreatePanchangCategoryMapDto {
  @ApiProperty()
  id: string;
}
