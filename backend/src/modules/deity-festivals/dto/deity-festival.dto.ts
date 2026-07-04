import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityFestivalQueryDto extends BaseQueryDto {}

export class CreateDeityFestivalDto {
  @ApiProperty()
  @IsUUID()
  festivalId: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  primaryDeity?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateDeityFestivalDto extends PartialType(CreateDeityFestivalDto) {}

export class DeityFestivalResponseDto extends CreateDeityFestivalDto {
  @ApiProperty()
  id: string;
}
