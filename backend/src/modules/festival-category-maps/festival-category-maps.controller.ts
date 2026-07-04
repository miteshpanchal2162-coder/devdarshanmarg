import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalCategoryMapDto,
  FestivalCategoryMapQueryDto,
  FestivalCategoryMapResponseDto,
  UpdateFestivalCategoryMapDto,
} from "./dto/festival-category-map.dto";
import { FestivalCategoryMapsService } from "./festival-category-maps.service";

@ApiTags("Festival Category Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/category-maps")
export class FestivalCategoryMapsController {
  constructor(private readonly service: FestivalCategoryMapsService) {}

  @Get()
  @ApiOperation({ summary: "List festival category maps" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalCategoryMapResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalCategoryMapQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival category map by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival category map" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalCategoryMapDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalCategoryMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival category map" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalCategoryMapDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalCategoryMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival category map" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }
}
