import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangCategoryDto,
  PanchangCategoryQueryDto,
  PanchangCategoryResponseDto,
  UpdatePanchangCategoryDto,
  UpdatePanchangCategoryStatusDto,
} from "./dto/panchang-category.dto";
import { PanchangCategoriesService } from "./panchang-categories.service";

@ApiTags("Panchang Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchang-categories")
export class PanchangCategoriesController {
  constructor(private readonly service: PanchangCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List panchang categories" })
  @ApiPaginatedResponse(PanchangCategoryResponseDto)
  findAll(@Query() query: PanchangCategoryQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang category by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang category" })
  @ApiBody({ type: CreatePanchangCategoryDto })
  create(@Body() dto: CreatePanchangCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.createCategory(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang category" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangCategoryDto })
  update(@Param("id") id: string, @Body() dto: UpdatePanchangCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.updateCategory(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete panchang category" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteCategory(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore panchang category" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreCategory(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update panchang category status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangCategoryStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdatePanchangCategoryStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
