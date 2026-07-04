import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../constants/crud.constants";

export class PaginationDto {
  @ApiPropertyOptional({ default: DEFAULT_PAGE })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page = DEFAULT_PAGE;

  @ApiPropertyOptional({ default: DEFAULT_PAGE_SIZE, maximum: MAX_PAGE_SIZE })
  @IsInt()
  @IsOptional()
  @Max(MAX_PAGE_SIZE)
  @Min(1)
  @Type(() => Number)
  limit = DEFAULT_PAGE_SIZE;
}
