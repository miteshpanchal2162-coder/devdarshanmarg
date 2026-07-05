import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import { PublicFestivalResponseDto } from "../dto/public-response.dto";
import { PublicFestivalsService } from "./public-festivals.service";

@ApiTags("Public - Festivals")
@Controller("public/festivals")
export class PublicFestivalsController {
  constructor(private readonly service: PublicFestivalsService) {}

  @Get()
  @ApiOperation({ summary: "List active festivals" })
  @ApiPaginatedResponse(PublicFestivalResponseDto)
  findAll(@Query() query: PublicQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get active festival by slug" })
  @ApiParam({ name: "slug", type: String })
  findBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }
}
