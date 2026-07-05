import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import {
  PublicSeoLandingPageResponseDto,
  PublicSeoRedirectResponseDto,
} from "../dto/public-response.dto";
import { PublicSeoService } from "./public-seo.service";

@ApiTags("Public - SEO")
@Controller("public/seo")
export class PublicSeoController {
  constructor(private readonly service: PublicSeoService) {}

  @Get("redirects")
  @ApiOperation({ summary: "List active SEO redirects" })
  @ApiPaginatedResponse(PublicSeoRedirectResponseDto)
  findRedirects(@Query() query: PublicQueryDto) {
    return this.service.findRedirects(query);
  }

  @Get("landing-pages/:slug")
  @ApiOperation({ summary: "Get active SEO landing page by slug" })
  @ApiParam({ name: "slug", type: String })
  findLandingPageBySlug(@Param("slug") slug: string) {
    return this.service.findLandingPageBySlug(slug);
  }
}
