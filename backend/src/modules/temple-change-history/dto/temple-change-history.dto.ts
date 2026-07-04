import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleChangeHistoryQueryDto extends BaseQueryDto {}

export class CreateTempleChangeHistoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fieldName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oldValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  newValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class UpdateTempleChangeHistoryDto extends PartialType(CreateTempleChangeHistoryDto) {}

export class TempleChangeHistoryResponseDto extends CreateTempleChangeHistoryDto {
  @ApiProperty()
  id: string;
}
