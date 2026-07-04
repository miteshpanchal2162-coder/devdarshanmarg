import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContinentQueryDto,
  ContinentResponseDto,
  CreateContinentDto,
  UpdateContinentDto,
  UpdateContinentStatusDto,
} from "./dto/continent.dto";
import { ContinentsService } from "./continents.service";

@ApiTags("Continents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("continents")
export class ContinentsController {
  constructor(private readonly continentsService: ContinentsService) {}

  @Get()
  @ApiOperation({ summary: "List continents" })
  @ApiPaginatedResponse(ContinentResponseDto)
  findAll(@Query() query: ContinentQueryDto) {
    return this.continentsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get continent by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.continentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create continent" })
  create(@Body() dto: CreateContinentDto, @Req() request: { user: AuthUser }) {
    return this.continentsService.createContinent(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update continent" })
  update(@Param("id") id: string, @Body() dto: UpdateContinentDto, @Req() request: { user: AuthUser }) {
    return this.continentsService.updateContinent(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete continent" })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.continentsService.deleteContinent(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore continent" })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.continentsService.restoreContinent(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update continent status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateContinentStatusDto, @Req() request: { user: AuthUser }) {
    return this.continentsService.updateStatus(id, dto.status, request.user.id);
  }
}
