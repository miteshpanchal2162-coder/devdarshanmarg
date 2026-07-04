import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleContactQueryDto extends BaseQueryDto {}

export class CreateTempleContactDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  personName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  availableFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  availableTo?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  priority?: number;

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

export class UpdateTempleContactDto extends PartialType(CreateTempleContactDto) {}

export class UpdateTempleContactStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleContactResponseDto extends CreateTempleContactDto {
  @ApiProperty()
  id: string;
}
