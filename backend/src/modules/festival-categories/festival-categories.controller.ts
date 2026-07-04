import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalCategoryDto,
  FestivalCategoryQueryDto,
  FestivalCategoryResponseDto,
  UpdateFestivalCategoryDto,
  UpdateFestivalCategoryStatusDto,
} from "./dto/festival-category.dto";
import { FestivalCategoriesService } from "./festival-categories.service";

@ApiTags("Festival Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festival-categories")
export class FestivalCategoriesController {
  constructor(private readonly service: FestivalCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List festival categories" })
  @ApiPaginatedResponse(FestivalCategoryResponseDto)
  findAll(@Query() query: FestivalCategoryQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival category by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival category" })
  @ApiBody({ type: CreateFestivalCategoryDto })
  create(@Body() dto: CreateFestivalCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.createCategory(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival category" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalCategoryDto })
  update(@Param("id") id: string, @Body() dto: UpdateFestivalCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.updateCategory(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete festival category" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteCategory(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival category" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreCategory(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival category status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalCategoryStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateFestivalCategoryStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
