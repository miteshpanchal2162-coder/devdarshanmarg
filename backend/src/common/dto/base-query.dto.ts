import { IntersectionType } from "@nestjs/swagger";
import { FilterDto } from "./filter.dto";
import { PaginationDto } from "./pagination.dto";
import { SearchDto } from "./search.dto";
import { SortDto } from "./sort.dto";

export class BaseQueryDto extends IntersectionType(
  IntersectionType(PaginationDto, SearchDto),
  IntersectionType(SortDto, FilterDto),
) {}
