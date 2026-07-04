import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ChoghadiyaQueryDto extends BaseQueryDto {}

export class CreateChoghadiyaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  periodType: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  choghadiyaType: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAuspicious?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateChoghadiyaDto extends PartialType(CreateChoghadiyaDto) {}

export class ChoghadiyaResponseDto extends CreateChoghadiyaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
