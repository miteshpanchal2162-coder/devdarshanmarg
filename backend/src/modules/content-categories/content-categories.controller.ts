import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentCategoryQueryDto,
  ContentCategoryResponseDto,
  CreateContentCategoryDto,
  UpdateContentCategoryDto,
  UpdateContentCategoryStatusDto,
} from "./dto/content-category.dto";
import { ContentCategoriesService } from "./content-categories.service";

@ApiTags("Content Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-categories")
export class ContentCategoriesController {
  constructor(private readonly service: ContentCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List content categories" })
  @ApiPaginatedResponse(ContentCategoryResponseDto)
  findAll(@Query() query: ContentCategoryQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content category by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content category" })
  @ApiBody({ type: CreateContentCategoryDto })
  create(@Body() dto: CreateContentCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.createCategory(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content category" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentCategoryDto })
  update(@Param("id") id: string, @Body() dto: UpdateContentCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.updateCategory(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content category" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteCategory(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore content category" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreCategory(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update content category status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentCategoryStatusDto })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateContentCategoryStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
