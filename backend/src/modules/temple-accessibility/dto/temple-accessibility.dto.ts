import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleAccessibilityQueryDto extends BaseQueryDto {}

export class CreateTempleAccessibilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accessibilityCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feature?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateTempleAccessibilityDto extends PartialType(CreateTempleAccessibilityDto) {}

export class UpdateTempleAccessibilityStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleAccessibilityResponseDto extends CreateTempleAccessibilityDto {
  @ApiProperty()
  id: string;
}
