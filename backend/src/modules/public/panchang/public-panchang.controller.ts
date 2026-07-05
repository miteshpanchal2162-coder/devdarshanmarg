import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import { PublicPanchangDateResponseDto, PublicPanchangResponseDto } from "../dto/public-response.dto";
import { PublicPanchangService } from "./public-panchang.service";

@ApiTags("Public - Panchang")
@Controller("public/panchang")
export class PublicPanchangController {
  constructor(private readonly service: PublicPanchangService) {}

  @Get()
  @ApiOperation({ summary: "List active panchangs" })
  @ApiPaginatedResponse(PublicPanchangResponseDto)
  findAll(@Query() query: PublicQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":slug/dates/:calendarDate")
  @ApiOperation({ summary: "Get panchang date by slug and calendar date (YYYY-MM-DD)" })
  @ApiParam({ name: "slug", type: String })
  @ApiParam({ name: "calendarDate", type: String, example: "2026-07-05" })
  findDateByCalendarDate(
    @Param("slug") slug: string,
    @Param("calendarDate") calendarDate: string,
  ) {
    return this.service.findDateByCalendarDate(slug, calendarDate);
  }

  @Get(":slug/dates")
  @ApiOperation({ summary: "List panchang dates for a panchang slug" })
  @ApiParam({ name: "slug", type: String })
  @ApiPaginatedResponse(PublicPanchangDateResponseDto)
  findDates(@Param("slug") slug: string, @Query() query: PublicQueryDto) {
    return this.service.findDates(slug, query);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get active panchang by slug" })
  @ApiParam({ name: "slug", type: String })
  findBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }
}
