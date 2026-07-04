import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleParkingQueryDto extends BaseQueryDto {}

export class CreateTempleParkingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parkingCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parkingType?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  capacity?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  freeParking?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  coveredParking?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  evCharging?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  securityAvailable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  cctvAvailable?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  distanceFromTemple?: number;

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

export class UpdateTempleParkingDto extends PartialType(CreateTempleParkingDto) {}

export class UpdateTempleParkingStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleParkingResponseDto extends CreateTempleParkingDto {
  @ApiProperty()
  id: string;
}
