import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import { PublicTempleResponseDto } from "../dto/public-response.dto";
import { PublicTemplesService } from "./public-temples.service";

@ApiTags("Public - Temples")
@Controller("public/temples")
export class PublicTemplesController {
  constructor(private readonly service: PublicTemplesService) {}

  @Get()
  @ApiOperation({ summary: "List published temples" })
  @ApiPaginatedResponse(PublicTempleResponseDto)
  findAll(@Query() query: PublicQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get published temple by slug" })
  @ApiParam({ name: "slug", type: String })
  findBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }
}
