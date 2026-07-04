import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class PanchangChangeHistoryQueryDto extends BaseQueryDto {}

export class CreatePanchangChangeHistoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  action: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  changedFields?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdatePanchangChangeHistoryDto extends PartialType(CreatePanchangChangeHistoryDto) {}

export class PanchangChangeHistoryResponseDto extends CreatePanchangChangeHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;
}
