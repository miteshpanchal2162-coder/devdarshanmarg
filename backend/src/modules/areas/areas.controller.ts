import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  AreaQueryDto,
  AreaResponseDto,
  CreateAreaDto,
  UpdateAreaDto,
  UpdateAreaStatusDto,
} from "./dto/area.dto";
import { AreasService } from "./areas.service";

@ApiTags("Areas")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("areas")
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @ApiOperation({ summary: "List areas" })
  @ApiPaginatedResponse(AreaResponseDto)
  findAll(@Query() query: AreaQueryDto) {
    return this.areasService.findAll(query);
  }

  @Get("by-city/:id")
  @ApiOperation({ summary: "List areas by city" })
  @ApiParam({ name: "id", type: String })
  @ApiPaginatedResponse(AreaResponseDto)
  findByCity(@Param("id") id: string, @Query() query: AreaQueryDto) {
    return this.areasService.findByCity(id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get area by ID" })
  findOne(@Param("id") id: string) {
    return this.areasService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create area" })
  create(@Body() dto: CreateAreaDto, @Req() request: { user: AuthUser }) {
    return this.areasService.createArea(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update area" })
  update(@Param("id") id: string, @Body() dto: UpdateAreaDto, @Req() request: { user: AuthUser }) {
    return this.areasService.updateArea(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete area" })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.areasService.deleteArea(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore area" })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.areasService.restoreArea(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update area status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateAreaStatusDto, @Req() request: { user: AuthUser }) {
    return this.areasService.updateStatus(id, dto.status, request.user.id);
  }
}
