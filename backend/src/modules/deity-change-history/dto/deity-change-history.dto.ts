import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityChangeHistoryQueryDto extends BaseQueryDto {}

export class CreateDeityChangeHistoryDto {
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

export class UpdateDeityChangeHistoryDto extends PartialType(CreateDeityChangeHistoryDto) {}

export class DeityChangeHistoryResponseDto extends CreateDeityChangeHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;
}
