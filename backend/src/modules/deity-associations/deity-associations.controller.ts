import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityAssociationDto,
  DeityAssociationQueryDto,
  DeityAssociationResponseDto,
  UpdateDeityAssociationDto,
  UpdateDeityAssociationStatusDto,
} from "./dto/deity-association.dto";
import { DeityAssociationsService } from "./deity-associations.service";

@ApiTags("Deity Associations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/associations")
export class DeityAssociationsController {
  constructor(private readonly service: DeityAssociationsService) {}

  @Get()
  @ApiOperation({ summary: "List deity associations" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityAssociationResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityAssociationQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity association by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity association" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityAssociationDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityAssociationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity association" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityAssociationDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityAssociationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity association" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity association" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(deityId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity association status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityAssociationStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityAssociationStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(deityId, id, dto.status, request.user.id);
  }
}
