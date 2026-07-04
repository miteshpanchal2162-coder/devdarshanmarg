import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityAttributeDto,
  DeityAttributeQueryDto,
  DeityAttributeResponseDto,
  UpdateDeityAttributeDto,
  UpdateDeityAttributeStatusDto,
} from "./dto/deity-attribute.dto";
import { DeityAttributesService } from "./deity-attributes.service";

@ApiTags("Deity Attributes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/attributes")
export class DeityAttributesController {
  constructor(private readonly service: DeityAttributesService) {}

  @Get()
  @ApiOperation({ summary: "List deity attributes" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityAttributeResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityAttributeQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity attribute by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity attribute" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityAttributeDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityAttributeDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity attribute" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityAttributeDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityAttributeDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity attribute" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity attribute" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(deityId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity attribute status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityAttributeStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityAttributeStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(deityId, id, dto.status, request.user.id);
  }
}
