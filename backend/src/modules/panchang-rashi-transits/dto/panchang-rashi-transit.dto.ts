import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class PanchangRashiTransitQueryDto extends BaseQueryDto {}

export class CreatePanchangRashiTransitDto {
  @ApiProperty()
  @IsUUID()
  planetId: string;

  @ApiProperty()
  @IsUUID()
  fromRashiId: string;

  @ApiProperty()
  @IsUUID()
  toRashiId: string;

  @ApiProperty()
  @IsDateString()
  transitTime: string;
}

export class UpdatePanchangRashiTransitDto extends PartialType(CreatePanchangRashiTransitDto) {}

export class PanchangRashiTransitResponseDto extends CreatePanchangRashiTransitDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
