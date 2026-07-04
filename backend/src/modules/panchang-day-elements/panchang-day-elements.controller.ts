import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreatePanchangDayElementDto,
  PanchangDayElementResponseDto,
  UpdatePanchangDayElementDto,
} from "./dto/panchang-day-element.dto";
import { PanchangDayElementsService } from "./panchang-day-elements.service";

@ApiTags("Panchang Day Elements")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/day-element")
export class PanchangDayElementsController {
  constructor(private readonly service: PanchangDayElementsService) {}

  @Get()
  @ApiOperation({ summary: "Get panchang day element" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  findByPanchangDate(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang day element" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreatePanchangDayElementDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreatePanchangDayElementDto,
  ) {
    return this.service.createDayElement(panchangId, panchangDateId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update panchang day element" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: UpdatePanchangDayElementDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: UpdatePanchangDayElementDto,
  ) {
    return this.service.updateDayElement(panchangId, panchangDateId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete panchang day element" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.deleteDayElement(panchangId, panchangDateId);
  }
}
