import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalDto,
  FestivalQueryDto,
  FestivalResponseDto,
  UpdateFestivalDto,
  UpdateFestivalStatusDto,
} from "./dto/festival.dto";
import { FestivalsService } from "./festivals.service";

@ApiTags("Festivals")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals")
export class FestivalsController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Get()
  @ApiOperation({ summary: "List festivals" })
  @ApiPaginatedResponse(FestivalResponseDto)
  findAll(@Query() query: FestivalQueryDto) {
    return this.festivalsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.festivalsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival" })
  @ApiBody({ type: CreateFestivalDto })
  create(@Body() dto: CreateFestivalDto, @Req() request: { user: AuthUser }) {
    return this.festivalsService.createFestival(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalDto })
  update(@Param("id") id: string, @Body() dto: UpdateFestivalDto, @Req() request: { user: AuthUser }) {
    return this.festivalsService.updateFestival(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete festival" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.festivalsService.deleteFestival(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.festivalsService.restoreFestival(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateFestivalStatusDto, @Req() request: { user: AuthUser }) {
    return this.festivalsService.updateFestivalStatus(id, dto.status, request.user.id);
  }
}
