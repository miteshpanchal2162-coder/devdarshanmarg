import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class VratFoodRuleQueryDto extends BaseQueryDto {}

export class CreateVratFoodRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  foodType?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  foodName: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  allowed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

export class UpdateVratFoodRuleDto extends PartialType(CreateVratFoodRuleDto) {}

export class UpdateVratFoodRuleStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class VratFoodRuleResponseDto extends CreateVratFoodRuleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vratId: string;

  @ApiPropertyOptional()
  createdBy: string | null;

  @ApiPropertyOptional()
  updatedBy: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
