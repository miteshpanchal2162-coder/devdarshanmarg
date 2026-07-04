import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleDeityMapQueryDto extends BaseQueryDto {}

export class CreateTempleDeityMapDto {
  @ApiProperty()
  @IsUUID()
  deityId: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateTempleDeityMapDto extends PartialType(CreateTempleDeityMapDto) {}

export class TempleDeityMapResponseDto extends CreateTempleDeityMapDto {
  @ApiProperty()
  id: string;
}
