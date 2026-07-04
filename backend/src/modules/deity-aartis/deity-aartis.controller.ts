import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityAartiDto,
  DeityAartiQueryDto,
  DeityAartiResponseDto,
  UpdateDeityAartiDto,
  UpdateDeityAartiStatusDto,
} from "./dto/deity-aarti.dto";
import { DeityAartisService } from "./deity-aartis.service";

@ApiTags("Deity Aartis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/aartis")
export class DeityAartisController {
  constructor(private readonly service: DeityAartisService) {}

  @Get()
  @ApiOperation({ summary: "List deity aartis" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityAartiResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityAartiQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity aarti by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity aarti" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityAartiDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityAartiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity aarti" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityAartiDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityAartiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity aarti" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity aarti" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(deityId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity aarti status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityAartiStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityAartiStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(deityId, id, dto.status, request.user.id);
  }
}
