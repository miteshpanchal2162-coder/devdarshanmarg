import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePlanetDto,
  PlanetQueryDto,
  PlanetResponseDto,
  UpdatePlanetDto,
  UpdatePlanetStatusDto,
} from "./dto/planet.dto";
import { PlanetsService } from "./planets.service";

@ApiTags("Planets")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("planets")
export class PlanetsController {
  constructor(private readonly service: PlanetsService) {}

  @Get()
  @ApiOperation({ summary: "List planets" })
  @ApiPaginatedResponse(PlanetResponseDto)
  findAll(@Query() query: PlanetQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get planet by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create planet" })
  @ApiBody({ type: CreatePlanetDto })
  create(@Body() dto: CreatePlanetDto, @Req() request: { user: AuthUser }) {
    return this.service.createPlanet(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update planet" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePlanetDto })
  update(@Param("id") id: string, @Body() dto: UpdatePlanetDto, @Req() request: { user: AuthUser }) {
    return this.service.updatePlanet(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete planet" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deletePlanet(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore planet" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restorePlanet(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update planet status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePlanetStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdatePlanetStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
