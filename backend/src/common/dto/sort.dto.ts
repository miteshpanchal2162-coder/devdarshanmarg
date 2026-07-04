import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { DEFAULT_SORT_DIRECTION, DEFAULT_SORT_FIELD } from "../constants/crud.constants";
import { SortDirection } from "../enums/crud.enum";

export class SortDto {
  @ApiPropertyOptional({ default: DEFAULT_SORT_FIELD })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  sortBy = DEFAULT_SORT_FIELD;

  @ApiPropertyOptional({ enum: SortDirection, default: DEFAULT_SORT_DIRECTION })
  @IsEnum(SortDirection)
  @IsOptional()
  sortOrder: SortDirection = SortDirection.DESC;
}
