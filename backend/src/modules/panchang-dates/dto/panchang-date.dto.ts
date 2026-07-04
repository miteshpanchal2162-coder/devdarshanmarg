import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class PanchangDateQueryDto extends BaseQueryDto {}

export class CreatePanchangDateDto {
  @ApiProperty()
  @IsDateString()
  calendarDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  hinduYear?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  vikramSamvat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  shakSamvat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ayana?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ritu?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  masa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  paksha?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  weekday?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  sunrise?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  sunset?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  moonrise?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  moonset?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

export class UpdatePanchangDateDto extends PartialType(CreatePanchangDateDto) {}

export class UpdatePanchangDateStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class PanchangDateResponseDto extends CreatePanchangDateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
