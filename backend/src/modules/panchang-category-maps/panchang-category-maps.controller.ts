import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangCategoryMapDto,
  PanchangCategoryMapQueryDto,
  PanchangCategoryMapResponseDto,
  UpdatePanchangCategoryMapDto,
} from "./dto/panchang-category-map.dto";
import { PanchangCategoryMapsService } from "./panchang-category-maps.service";

@ApiTags("Panchang Category Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/category-maps")
export class PanchangCategoryMapsController {
  constructor(private readonly service: PanchangCategoryMapsService) {}

  @Get()
  @ApiOperation({ summary: "List panchang category maps" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiPaginatedResponse(PanchangCategoryMapResponseDto)
  findAll(@Param("panchangId") panchangId: string, @Query() query: PanchangCategoryMapQueryDto) {
    return this.service.findByPanchang(panchangId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang category map by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("panchangId") panchangId: string, @Param("id") id: string) {
    return this.service.findChildById(panchangId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang category map" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangCategoryMapDto })
  create(
    @Param("panchangId") panchangId: string,
    @Body() dto: CreatePanchangCategoryMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang category map" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangCategoryMapDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangCategoryMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang category map" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(panchangId, id, request.user.id);
  }
}
