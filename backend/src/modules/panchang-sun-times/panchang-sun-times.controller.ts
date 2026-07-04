import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreatePanchangSunTimeDto,
  PanchangSunTimeResponseDto,
  UpdatePanchangSunTimeDto,
} from "./dto/panchang-sun-time.dto";
import { PanchangSunTimesService } from "./panchang-sun-times.service";

@ApiTags("Panchang Sun Times")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/sun-times")
export class PanchangSunTimesController {
  constructor(private readonly service: PanchangSunTimesService) {}

  @Get()
  @ApiOperation({ summary: "Get panchang sun times" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  findByPanchangDate(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId);
  }

  @Post()
  @ApiOperation({ summary: "Set panchang sun times" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreatePanchangSunTimeDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreatePanchangSunTimeDto,
  ) {
    return this.service.createSunTimes(panchangId, panchangDateId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update panchang sun times" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: UpdatePanchangSunTimeDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: UpdatePanchangSunTimeDto,
  ) {
    return this.service.updateSunTimes(panchangId, panchangDateId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Clear panchang sun times" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.clearSunTimes(panchangId, panchangDateId);
  }
}
