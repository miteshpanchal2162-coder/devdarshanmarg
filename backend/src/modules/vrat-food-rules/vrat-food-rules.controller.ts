import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateVratFoodRuleDto,
  UpdateVratFoodRuleDto,
  UpdateVratFoodRuleStatusDto,
  VratFoodRuleQueryDto,
  VratFoodRuleResponseDto,
} from "./dto/vrat-food-rule.dto";
import { VratFoodRulesService } from "./vrat-food-rules.service";

@ApiTags("Vrat Food Rules")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("vrats/:vratId/food-rules")
export class VratFoodRulesController {
  constructor(private readonly service: VratFoodRulesService) {}

  @Get()
  @ApiOperation({ summary: "List vrat food rules" })
  @ApiParam({ name: "vratId", type: String })
  @ApiPaginatedResponse(VratFoodRuleResponseDto)
  findAll(@Param("vratId") vratId: string, @Query() query: VratFoodRuleQueryDto) {
    return this.service.findByVrat(vratId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vrat food rule by ID" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("vratId") vratId: string, @Param("id") id: string) {
    return this.service.findChildById(vratId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create vrat food rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiBody({ type: CreateVratFoodRuleDto })
  create(
    @Param("vratId") vratId: string,
    @Body() dto: CreateVratFoodRuleDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(vratId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update vrat food rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratFoodRuleDto })
  update(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratFoodRuleDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(vratId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete vrat food rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(vratId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore vrat food rule" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(vratId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update vrat food rule status" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratFoodRuleStatusDto })
  updateStatus(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratFoodRuleStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(vratId, id, dto.status, request.user.id);
  }
}
