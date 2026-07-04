import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class FestivalCategoryMapQueryDto extends BaseQueryDto {}

export class CreateFestivalCategoryMapDto {
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

export class UpdateFestivalCategoryMapDto extends PartialType(CreateFestivalCategoryMapDto) {}

export class FestivalCategoryMapResponseDto extends CreateFestivalCategoryMapDto {
  @ApiProperty()
  id: string;
}
