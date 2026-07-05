import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import { PublicDeityResponseDto } from "../dto/public-response.dto";
import { PublicDeitiesService } from "./public-deities.service";

@ApiTags("Public - Deities")
@Controller("public/deities")
export class PublicDeitiesController {
  constructor(private readonly service: PublicDeitiesService) {}

  @Get()
  @ApiOperation({ summary: "List active deities" })
  @ApiPaginatedResponse(PublicDeityResponseDto)
  findAll(@Query() query: PublicQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get active deity by slug" })
  @ApiParam({ name: "slug", type: String })
  findBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }
}
