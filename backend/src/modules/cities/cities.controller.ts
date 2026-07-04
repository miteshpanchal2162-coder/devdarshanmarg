import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CityQueryDto,
  CityResponseDto,
  CreateCityDto,
  UpdateCityDto,
  UpdateCityStatusDto,
} from "./dto/city.dto";
import { CitiesService } from "./cities.service";

@ApiTags("Cities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("cities")
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: "List cities" })
  @ApiPaginatedResponse(CityResponseDto)
  findAll(@Query() query: CityQueryDto) {
    return this.citiesService.findAll(query);
  }

  @Get("by-state/:id")
  @ApiOperation({ summary: "List cities by state" })
  @ApiParam({ name: "id", type: String })
  @ApiPaginatedResponse(CityResponseDto)
  findByState(@Param("id") id: string, @Query() query: CityQueryDto) {
    return this.citiesService.findByState(id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get city by ID" })
  findOne(@Param("id") id: string) {
    return this.citiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create city" })
  create(@Body() dto: CreateCityDto, @Req() request: { user: AuthUser }) {
    return this.citiesService.createCity(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update city" })
  update(@Param("id") id: string, @Body() dto: UpdateCityDto, @Req() request: { user: AuthUser }) {
    return this.citiesService.updateCity(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete city" })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.citiesService.deleteCity(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore city" })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.citiesService.restoreCity(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update city status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateCityStatusDto, @Req() request: { user: AuthUser }) {
    return this.citiesService.updateStatus(id, dto.status, request.user.id);
  }
}
