import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateSeoRedirectDto,
  SeoRedirectQueryDto,
  SeoRedirectResponseDto,
  UpdateSeoRedirectDto,
} from "./dto/seo-redirect.dto";
import { SeoRedirectsService } from "./seo-redirects.service";

@ApiTags("SEO Redirects")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("seo-redirects")
export class SeoRedirectsController {
  constructor(private readonly service: SeoRedirectsService) {}

  @Get()
  @ApiOperation({ summary: "List SEO redirects" })
  @ApiPaginatedResponse(SeoRedirectResponseDto)
  findAll(@Query() query: SeoRedirectQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get SEO redirect by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create SEO redirect" })
  @ApiBody({ type: CreateSeoRedirectDto })
  create(@Body() dto: CreateSeoRedirectDto) {
    return this.service.createRedirect(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update SEO redirect" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSeoRedirectDto })
  update(@Param("id") id: string, @Body() dto: UpdateSeoRedirectDto) {
    return this.service.updateRedirect(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete SEO redirect" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteRedirect(id);
  }
}
