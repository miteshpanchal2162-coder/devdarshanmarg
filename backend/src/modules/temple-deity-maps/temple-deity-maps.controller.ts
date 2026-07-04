import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleDeityMapDto, TempleDeityMapQueryDto, TempleDeityMapResponseDto, UpdateTempleDeityMapDto } from "./dto/temple-deity-map.dto";
import { TempleDeityMapsService } from "./temple-deity-maps.service";

@ApiTags("Temple Deity Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/deity-maps")
export class TempleDeityMapsController {
  constructor(private readonly service: TempleDeityMapsService) {}

  @Get()
  @ApiOperation({ summary: "List temple deity maps" })
  @ApiParam({ name: "templeId", type: String })
  @ApiPaginatedResponse(TempleDeityMapResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleDeityMapQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple deity map by ID" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple deity map" })
  @ApiParam({ name: "templeId", type: String })
  @ApiBody({ type: CreateTempleDeityMapDto })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleDeityMapDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple deity map" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleDeityMapDto })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleDeityMapDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple deity map" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }
}
