import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateSeoLandingPageDto,
  SeoLandingPageQueryDto,
  SeoLandingPageResponseDto,
  UpdateSeoLandingPageDto,
} from "./dto/seo-landing-page.dto";
import { SeoLandingPagesService } from "./seo-landing-pages.service";

@ApiTags("SEO Landing Pages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("seo-landing-pages")
export class SeoLandingPagesController {
  constructor(private readonly service: SeoLandingPagesService) {}

  @Get()
  @ApiOperation({ summary: "List SEO landing pages" })
  @ApiPaginatedResponse(SeoLandingPageResponseDto)
  findAll(@Query() query: SeoLandingPageQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get SEO landing page by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create SEO landing page" })
  @ApiBody({ type: CreateSeoLandingPageDto })
  create(@Body() dto: CreateSeoLandingPageDto) {
    return this.service.createLandingPage(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update SEO landing page" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSeoLandingPageDto })
  update(@Param("id") id: string, @Body() dto: UpdateSeoLandingPageDto) {
    return this.service.updateLandingPage(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete SEO landing page" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteLandingPage(id);
  }
}
