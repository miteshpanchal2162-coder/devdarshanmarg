import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityTempleMapDto,
  DeityTempleMapQueryDto,
  DeityTempleMapResponseDto,
  UpdateDeityTempleMapDto,
} from "./dto/deity-temple-map.dto";
import { DeityTempleMapsService } from "./deity-temple-maps.service";

@ApiTags("Deity Temple Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/temple-maps")
export class DeityTempleMapsController {
  constructor(private readonly service: DeityTempleMapsService) {}

  @Get()
  @ApiOperation({ summary: "List deity temple maps" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityTempleMapResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityTempleMapQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity temple map by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity temple map" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityTempleMapDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityTempleMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity temple map" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityTempleMapDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityTempleMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity temple map" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }
}
