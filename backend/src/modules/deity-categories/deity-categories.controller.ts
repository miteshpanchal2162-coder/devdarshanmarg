import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityCategoryDto,
  DeityCategoryQueryDto,
  DeityCategoryResponseDto,
  UpdateDeityCategoryDto,
  UpdateDeityCategoryStatusDto,
} from "./dto/deity-category.dto";
import { DeityCategoriesService } from "./deity-categories.service";

@ApiTags("Deity Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deity-categories")
export class DeityCategoriesController {
  constructor(private readonly service: DeityCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List deity categories" })
  @ApiPaginatedResponse(DeityCategoryResponseDto)
  findAll(@Query() query: DeityCategoryQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity category by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity category" })
  @ApiBody({ type: CreateDeityCategoryDto })
  create(@Body() dto: CreateDeityCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.createCategory(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity category" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityCategoryDto })
  update(@Param("id") id: string, @Body() dto: UpdateDeityCategoryDto, @Req() request: { user: AuthUser }) {
    return this.service.updateCategory(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete deity category" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteCategory(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity category" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreCategory(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity category status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityCategoryStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateDeityCategoryStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
