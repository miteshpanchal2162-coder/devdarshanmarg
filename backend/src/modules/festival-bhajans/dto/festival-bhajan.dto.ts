import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class FestivalBhajanQueryDto extends BaseQueryDto {}

export class CreateFestivalBhajanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  languageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bhajanCode?: string;

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
  lyrics?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  composer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  raga?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

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

export class UpdateFestivalBhajanDto extends PartialType(CreateFestivalBhajanDto) {}

export class UpdateFestivalBhajanStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class FestivalBhajanResponseDto extends CreateFestivalBhajanDto {
  @ApiProperty()
  id: string;
}
