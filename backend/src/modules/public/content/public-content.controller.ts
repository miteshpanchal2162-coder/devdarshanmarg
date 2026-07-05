import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import {
  PublicContentItemResponseDto,
  PublicLegacyContentResponseDto,
} from "../dto/public-response.dto";
import { PublicContentService } from "./public-content.service";

@ApiTags("Public - Content")
@Controller("public/content")
export class PublicContentController {
  constructor(private readonly service: PublicContentService) {}

  @Get("pages")
  @ApiOperation({ summary: "List published legacy content pages" })
  @ApiPaginatedResponse(PublicLegacyContentResponseDto)
  findAllLegacyPages(@Query() query: PublicQueryDto) {
    return this.service.findAllLegacyPages(query);
  }

  @Get("pages/:slug")
  @ApiOperation({ summary: "Get published legacy content page by slug" })
  @ApiParam({ name: "slug", type: String })
  findLegacyPageBySlug(@Param("slug") slug: string) {
    return this.service.findLegacyPageBySlug(slug);
  }

  @Get()
  @ApiOperation({ summary: "List published content items" })
  @ApiPaginatedResponse(PublicContentItemResponseDto)
  findAllItems(@Query() query: PublicQueryDto) {
    return this.service.findAllItems(query);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get published content item by slug" })
  @ApiParam({ name: "slug", type: String })
  findItemBySlug(@Param("slug") slug: string) {
    return this.service.findItemBySlug(slug);
  }
}
