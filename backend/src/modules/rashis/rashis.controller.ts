import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateRashiDto,
  RashiQueryDto,
  RashiResponseDto,
  UpdateRashiDto,
  UpdateRashiStatusDto,
} from "./dto/rashi.dto";
import { RashisService } from "./rashis.service";

@ApiTags("Rashis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("rashis")
export class RashisController {
  constructor(private readonly service: RashisService) {}

  @Get()
  @ApiOperation({ summary: "List rashis" })
  @ApiPaginatedResponse(RashiResponseDto)
  findAll(@Query() query: RashiQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get rashi by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create rashi" })
  @ApiBody({ type: CreateRashiDto })
  create(@Body() dto: CreateRashiDto, @Req() request: { user: AuthUser }) {
    return this.service.createRashi(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update rashi" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateRashiDto })
  update(@Param("id") id: string, @Body() dto: UpdateRashiDto, @Req() request: { user: AuthUser }) {
    return this.service.updateRashi(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete rashi" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteRashi(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore rashi" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreRashi(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update rashi status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateRashiStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateRashiStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
