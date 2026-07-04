import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityRelationQueryDto extends BaseQueryDto {}

export class CreateDeityRelationDto {
  @ApiProperty()
  @IsUUID()
  relatedDeityId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  relationCode: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  relationType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

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

export class UpdateDeityRelationDto extends PartialType(CreateDeityRelationDto) {}

export class DeityRelationResponseDto extends CreateDeityRelationDto {
  @ApiProperty()
  id: string;
}
