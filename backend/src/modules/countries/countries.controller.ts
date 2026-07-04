import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CountryQueryDto,
  CountryResponseDto,
  CreateCountryDto,
  UpdateCountryDto,
  UpdateCountryStatusDto,
} from "./dto/country.dto";
import { CountriesService } from "./countries.service";

@ApiTags("Countries")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: "List countries" })
  @ApiPaginatedResponse(CountryResponseDto)
  findAll(@Query() query: CountryQueryDto) {
    return this.countriesService.findAll(query);
  }

  @Get("by-continent/:id")
  @ApiOperation({ summary: "List countries by continent" })
  @ApiParam({ name: "id", type: String })
  @ApiPaginatedResponse(CountryResponseDto)
  findByContinent(@Param("id") id: string, @Query() query: CountryQueryDto) {
    return this.countriesService.findByContinent(id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get country by ID" })
  findOne(@Param("id") id: string) {
    return this.countriesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create country" })
  create(@Body() dto: CreateCountryDto, @Req() request: { user: AuthUser }) {
    return this.countriesService.createCountry(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update country" })
  update(@Param("id") id: string, @Body() dto: UpdateCountryDto, @Req() request: { user: AuthUser }) {
    return this.countriesService.updateCountry(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete country" })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.countriesService.deleteCountry(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore country" })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.countriesService.restoreCountry(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update country status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateCountryStatusDto, @Req() request: { user: AuthUser }) {
    return this.countriesService.updateStatus(id, dto.status, request.user.id);
  }
}
