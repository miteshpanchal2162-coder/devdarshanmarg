import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalTempleMapDto,
  FestivalTempleMapQueryDto,
  FestivalTempleMapResponseDto,
  UpdateFestivalTempleMapDto,
} from "./dto/festival-temple-map.dto";
import { FestivalTempleMapsService } from "./festival-temple-maps.service";

@ApiTags("Festival Temple Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/temple-maps")
export class FestivalTempleMapsController {
  constructor(private readonly service: FestivalTempleMapsService) {}

  @Get()
  @ApiOperation({ summary: "List festival temple maps" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalTempleMapResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalTempleMapQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival temple map by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival temple map" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalTempleMapDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalTempleMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival temple map" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalTempleMapDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalTempleMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival temple map" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }
}
