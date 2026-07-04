import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityAttributeQueryDto extends BaseQueryDto {}

export class CreateDeityAttributeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  attributeCode: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  attributeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attributeValue?: string;

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

export class UpdateDeityAttributeDto extends PartialType(CreateDeityAttributeDto) {}

export class UpdateDeityAttributeStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class DeityAttributeResponseDto extends CreateDeityAttributeDto {
  @ApiProperty()
  id: string;
}
