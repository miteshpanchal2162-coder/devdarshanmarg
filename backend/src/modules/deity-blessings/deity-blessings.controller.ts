import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityBlessingDto,
  DeityBlessingQueryDto,
  DeityBlessingResponseDto,
  UpdateDeityBlessingDto,
  UpdateDeityBlessingStatusDto,
} from "./dto/deity-blessing.dto";
import { DeityBlessingsService } from "./deity-blessings.service";

@ApiTags("Deity Blessings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/blessings")
export class DeityBlessingsController {
  constructor(private readonly service: DeityBlessingsService) {}

  @Get()
  @ApiOperation({ summary: "List deity blessings" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityBlessingResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityBlessingQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity blessing by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity blessing" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityBlessingDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityBlessingDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity blessing" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityBlessingDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityBlessingDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity blessing" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity blessing" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(deityId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity blessing status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityBlessingStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityBlessingStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(deityId, id, dto.status, request.user.id);
  }
}
