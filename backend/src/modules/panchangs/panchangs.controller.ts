import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangDto,
  PanchangQueryDto,
  PanchangResponseDto,
  UpdatePanchangDto,
  UpdatePanchangStatusDto,
} from "./dto/panchang.dto";
import { PanchangsService } from "./panchangs.service";

@ApiTags("Panchangs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs")
export class PanchangsController {
  constructor(private readonly panchangsService: PanchangsService) {}

  @Get()
  @ApiOperation({ summary: "List panchangs" })
  @ApiPaginatedResponse(PanchangResponseDto)
  findAll(@Query() query: PanchangQueryDto) {
    return this.panchangsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.panchangsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang" })
  @ApiBody({ type: CreatePanchangDto })
  create(@Body() dto: CreatePanchangDto, @Req() request: { user: AuthUser }) {
    return this.panchangsService.createPanchang(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangDto })
  update(@Param("id") id: string, @Body() dto: UpdatePanchangDto, @Req() request: { user: AuthUser }) {
    return this.panchangsService.updatePanchang(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete panchang" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.panchangsService.deletePanchang(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore panchang" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.panchangsService.restorePanchang(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update panchang status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdatePanchangStatusDto, @Req() request: { user: AuthUser }) {
    return this.panchangsService.updatePanchangStatus(id, dto.status, request.user.id);
  }
}
