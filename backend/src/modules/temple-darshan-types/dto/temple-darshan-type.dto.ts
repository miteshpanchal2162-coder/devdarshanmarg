import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleDarshanTypeQueryDto extends BaseQueryDto {}

export class CreateTempleDarshanTypeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  darshanCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendedFor?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ticketPrice?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  estimatedWaitingMinutes?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  vip?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  onlineBooking?: boolean;

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

export class UpdateTempleDarshanTypeDto extends PartialType(CreateTempleDarshanTypeDto) {}

export class UpdateTempleDarshanTypeStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleDarshanTypeResponseDto extends CreateTempleDarshanTypeDto {
  @ApiProperty()
  id: string;
}
