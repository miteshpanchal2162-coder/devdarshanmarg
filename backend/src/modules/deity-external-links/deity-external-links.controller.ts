import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityExternalLinkDto,
  DeityExternalLinkQueryDto,
  DeityExternalLinkResponseDto,
  UpdateDeityExternalLinkDto,
  UpdateDeityExternalLinkStatusDto,
} from "./dto/deity-external-link.dto";
import { DeityExternalLinksService } from "./deity-external-links.service";

@ApiTags("Deity External Links")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/external-links")
export class DeityExternalLinksController {
  constructor(private readonly service: DeityExternalLinksService) {}

  @Get()
  @ApiOperation({ summary: "List deity external links" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityExternalLinkResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityExternalLinkQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity external link by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity external link" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityExternalLinkDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityExternalLinkDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity external link" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityExternalLinkDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityExternalLinkDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity external link" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity external link" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(deityId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity external link status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityExternalLinkStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityExternalLinkStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(deityId, id, dto.status, request.user.id);
  }
}
