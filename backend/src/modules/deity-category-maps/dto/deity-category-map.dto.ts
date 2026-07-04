import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityCategoryMapQueryDto extends BaseQueryDto {}

export class CreateDeityCategoryMapDto {
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

export class UpdateDeityCategoryMapDto extends PartialType(CreateDeityCategoryMapDto) {}

export class DeityCategoryMapResponseDto extends CreateDeityCategoryMapDto {
  @ApiProperty()
  id: string;
}
