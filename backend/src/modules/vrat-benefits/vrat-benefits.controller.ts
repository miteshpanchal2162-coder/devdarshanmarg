import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateVratBenefitDto,
  UpdateVratBenefitDto,
  UpdateVratBenefitStatusDto,
  VratBenefitQueryDto,
  VratBenefitResponseDto,
} from "./dto/vrat-benefit.dto";
import { VratBenefitsService } from "./vrat-benefits.service";

@ApiTags("Vrat Benefits")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("vrats/:vratId/benefits")
export class VratBenefitsController {
  constructor(private readonly service: VratBenefitsService) {}

  @Get()
  @ApiOperation({ summary: "List vrat benefits" })
  @ApiParam({ name: "vratId", type: String })
  @ApiPaginatedResponse(VratBenefitResponseDto)
  findAll(@Param("vratId") vratId: string, @Query() query: VratBenefitQueryDto) {
    return this.service.findByVrat(vratId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vrat benefit by ID" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("vratId") vratId: string, @Param("id") id: string) {
    return this.service.findChildById(vratId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create vrat benefit" })
  @ApiParam({ name: "vratId", type: String })
  @ApiBody({ type: CreateVratBenefitDto })
  create(
    @Param("vratId") vratId: string,
    @Body() dto: CreateVratBenefitDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(vratId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update vrat benefit" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratBenefitDto })
  update(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratBenefitDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(vratId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete vrat benefit" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(vratId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore vrat benefit" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(vratId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update vrat benefit status" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratBenefitStatusDto })
  updateStatus(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratBenefitStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(vratId, id, dto.status, request.user.id);
  }
}
