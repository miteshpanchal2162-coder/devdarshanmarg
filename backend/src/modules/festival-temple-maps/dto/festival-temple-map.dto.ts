import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class FestivalTempleMapQueryDto extends BaseQueryDto {}

export class CreateFestivalTempleMapDto {
  @ApiProperty()
  @IsUUID()
  templeId: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateFestivalTempleMapDto extends PartialType(CreateFestivalTempleMapDto) {}

export class FestivalTempleMapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  festivalId: string;

  @ApiProperty()
  templeId: string;

  @ApiProperty()
  highlight: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
