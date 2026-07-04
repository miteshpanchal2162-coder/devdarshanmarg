import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleNearbyPlaceDto, TempleNearbyPlaceQueryDto, TempleNearbyPlaceResponseDto, UpdateTempleNearbyPlaceDto, UpdateTempleNearbyPlaceStatusDto } from "./dto/temple-nearby-place.dto";
import { TempleNearbyPlacesService } from "./temple-nearby-places.service";

@ApiTags("Temple Nearby Places")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/nearby-places")
export class TempleNearbyPlacesController {
  constructor(private readonly service: TempleNearbyPlacesService) {}

  @Get()
  @ApiOperation({ summary: "List temple nearby places" })
  @ApiPaginatedResponse(TempleNearbyPlaceResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleNearbyPlaceQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple nearby place by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple nearby place" })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleNearbyPlaceDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple nearby place" })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleNearbyPlaceDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple nearby place" })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple nearby place" })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple nearby place status" })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleNearbyPlaceStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
