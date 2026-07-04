import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangExternalLinkDto,
  PanchangExternalLinkQueryDto,
  PanchangExternalLinkResponseDto,
  UpdatePanchangExternalLinkDto,
  UpdatePanchangExternalLinkStatusDto,
} from "./dto/panchang-external-link.dto";
import { PanchangExternalLinksService } from "./panchang-external-links.service";

@ApiTags("Panchang External Links")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/external-links")
export class PanchangExternalLinksController {
  constructor(private readonly service: PanchangExternalLinksService) {}

  @Get()
  @ApiOperation({ summary: "List panchang external links" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiPaginatedResponse(PanchangExternalLinkResponseDto)
  findAll(@Param("panchangId") panchangId: string, @Query() query: PanchangExternalLinkQueryDto) {
    return this.service.findByPanchang(panchangId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang external link by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("panchangId") panchangId: string, @Param("id") id: string) {
    return this.service.findChildById(panchangId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang external link" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangExternalLinkDto })
  create(
    @Param("panchangId") panchangId: string,
    @Body() dto: CreatePanchangExternalLinkDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang external link" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangExternalLinkDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangExternalLinkDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang external link" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(panchangId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore panchang external link" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(panchangId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update panchang external link status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangExternalLinkStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangExternalLinkStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(panchangId, id, dto.status, request.user.id);
  }
}
