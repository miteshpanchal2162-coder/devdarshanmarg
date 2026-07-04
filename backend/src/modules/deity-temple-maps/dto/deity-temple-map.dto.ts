import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityTempleMapQueryDto extends BaseQueryDto {}

export class CreateDeityTempleMapDto {
  @ApiProperty()
  @IsUUID()
  templeId: string;

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

export class UpdateDeityTempleMapDto extends PartialType(CreateDeityTempleMapDto) {}

export class DeityTempleMapResponseDto extends CreateDeityTempleMapDto {
  @ApiProperty()
  id: string;
}
