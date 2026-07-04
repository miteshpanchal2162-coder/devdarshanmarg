import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateVratDto,
  UpdateVratDto,
  UpdateVratStatusDto,
  VratQueryDto,
  VratResponseDto,
} from "./dto/vrat.dto";
import { VratsService } from "./vrats.service";

@ApiTags("Vrats")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("vrats")
export class VratsController {
  constructor(private readonly service: VratsService) {}

  @Get()
  @ApiOperation({ summary: "List vrats" })
  @ApiPaginatedResponse(VratResponseDto)
  findAll(@Query() query: VratQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vrat by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create vrat" })
  @ApiBody({ type: CreateVratDto })
  create(@Body() dto: CreateVratDto, @Req() request: { user: AuthUser }) {
    return this.service.createVrat(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update vrat" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratDto })
  update(@Param("id") id: string, @Body() dto: UpdateVratDto, @Req() request: { user: AuthUser }) {
    return this.service.updateVrat(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete vrat" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteVrat(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore vrat" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreVrat(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update vrat status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateVratStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
