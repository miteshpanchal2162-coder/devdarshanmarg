import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class TempleDressCodeQueryDto extends BaseQueryDto {}

export class CreateTempleDressCodeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dressCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicableAgeGroup?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  mandatory?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  festivalOnly?: boolean;

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

export class UpdateTempleDressCodeDto extends PartialType(CreateTempleDressCodeDto) {}

export class UpdateTempleDressCodeStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class TempleDressCodeResponseDto extends CreateTempleDressCodeDto {
  @ApiProperty()
  id: string;
}
