import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateTempleCategoryDto,
  TempleCategoryQueryDto,
  TempleCategoryResponseDto,
  UpdateTempleCategoryDto,
  UpdateTempleCategoryStatusDto,
} from "./dto/temple-category.dto";
import { TempleCategoriesService } from "./temple-categories.service";

@ApiTags("Temple Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temple-categories")
export class TempleCategoriesController {
  constructor(private readonly service: TempleCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List temple categories" })
  @ApiPaginatedResponse(TempleCategoryResponseDto)
  findAll(@Query() query: TempleCategoryQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple category by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple category" })
  @ApiBody({ type: CreateTempleCategoryDto })
  create(@Body() dto: CreateTempleCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.createCategory(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple category" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleCategoryDto })
  update(@Param("id") id: string, @Body() dto: UpdateTempleCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.updateCategory(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete temple category" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteCategory(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple category" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreCategory(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple category status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleCategoryStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateTempleCategoryStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
