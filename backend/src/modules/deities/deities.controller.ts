import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityDto,
  DeityQueryDto,
  DeityResponseDto,
  UpdateDeityDto,
  UpdateDeityStatusDto,
} from "./dto/deity.dto";
import { DeitiesService } from "./deities.service";

@ApiTags("Deities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities")
export class DeitiesController {
  constructor(private readonly deitiesService: DeitiesService) {}

  @Get()
  @ApiOperation({ summary: "List deities" })
  @ApiPaginatedResponse(DeityResponseDto)
  findAll(@Query() query: DeityQueryDto) {
    return this.deitiesService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.deitiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity" })
  @ApiBody({ type: CreateDeityDto })
  create(@Body() dto: CreateDeityDto, @Req() request: { user: AuthUser }) {
    return this.deitiesService.createDeity(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityDto })
  update(@Param("id") id: string, @Body() dto: UpdateDeityDto, @Req() request: { user: AuthUser }) {
    return this.deitiesService.updateDeity(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete deity" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.deitiesService.deleteDeity(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.deitiesService.restoreDeity(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateDeityStatusDto, @Req() request: { user: AuthUser }) {
    return this.deitiesService.updateDeityStatus(id, dto.status, request.user.id);
  }
}
