import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateVratRuleDto,
  UpdateVratRuleDto,
  UpdateVratRuleStatusDto,
  VratRuleQueryDto,
  VratRuleResponseDto,
} from "./dto/vrat-rule.dto";
import { VratRulesService } from "./vrat-rules.service";

@ApiTags("Vrat Rules")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("vrats/:vratId/rules")
export class VratRulesController {
  constructor(private readonly service: VratRulesService) {}

  @Get()
  @ApiOperation({ summary: "List vrat rules" })
  @ApiParam({ name: "vratId", type: String })
  @ApiPaginatedResponse(VratRuleResponseDto)
  findAll(@Param("vratId") vratId: string, @Query() query: VratRuleQueryDto) {
    return this.service.findByVrat(vratId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vrat rule by ID" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("vratId") vratId: string, @Param("id") id: string) {
    return this.service.findChildById(vratId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create vrat rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiBody({ type: CreateVratRuleDto })
  create(
    @Param("vratId") vratId: string,
    @Body() dto: CreateVratRuleDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(vratId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update vrat rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratRuleDto })
  update(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratRuleDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(vratId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete vrat rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(vratId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore vrat rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(vratId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update vrat rule status" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratRuleStatusDto })
  updateStatus(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratRuleStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(vratId, id, dto.status, request.user.id);
  }
}
