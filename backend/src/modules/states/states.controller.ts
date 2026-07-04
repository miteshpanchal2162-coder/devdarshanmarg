import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateStateDto,
  StateQueryDto,
  StateResponseDto,
  UpdateStateDto,
  UpdateStateStatusDto,
} from "./dto/state.dto";
import { StatesService } from "./states.service";

@ApiTags("States")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("states")
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  @ApiOperation({ summary: "List states" })
  @ApiPaginatedResponse(StateResponseDto)
  findAll(@Query() query: StateQueryDto) {
    return this.statesService.findAll(query);
  }

  @Get("by-country/:id")
  @ApiOperation({ summary: "List states by country" })
  @ApiParam({ name: "id", type: String })
  @ApiPaginatedResponse(StateResponseDto)
  findByCountry(@Param("id") id: string, @Query() query: StateQueryDto) {
    return this.statesService.findByCountry(id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get state by ID" })
  findOne(@Param("id") id: string) {
    return this.statesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create state" })
  create(@Body() dto: CreateStateDto, @Req() request: { user: AuthUser }) {
    return this.statesService.createState(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update state" })
  update(@Param("id") id: string, @Body() dto: UpdateStateDto, @Req() request: { user: AuthUser }) {
    return this.statesService.updateState(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete state" })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.statesService.deleteState(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore state" })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.statesService.restoreState(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update state status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateStateStatusDto, @Req() request: { user: AuthUser }) {
    return this.statesService.updateStatus(id, dto.status, request.user.id);
  }
}
