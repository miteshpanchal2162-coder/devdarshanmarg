import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class FestivalMantraQueryDto extends BaseQueryDto {}

export class CreateFestivalMantraDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  languageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mantraCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mantra?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meaning?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  recitationCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioUrl?: string;

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

export class UpdateFestivalMantraDto extends PartialType(CreateFestivalMantraDto) {}

export class UpdateFestivalMantraStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class FestivalMantraResponseDto extends CreateFestivalMantraDto {
  @ApiProperty()
  id: string;
}
