import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreatePanchangStatisticsDto,
  UpdatePanchangStatisticsDto,
  UpdatePanchangStatisticsStatusDto,
} from "./dto/panchang-statistics.dto";
import { PanchangStatisticsService } from "./panchang-statistics.service";

@ApiTags("Panchang Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/statistics")
export class PanchangStatisticsController {
  constructor(private readonly service: PanchangStatisticsService) {}

  @Get()
  @ApiOperation({ summary: "Get panchang statistics" })
  @ApiParam({ name: "panchangId", type: String })
  findByPanchang(@Param("panchangId") panchangId: string) {
    return this.service.findByPanchang(panchangId);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang statistics" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangStatisticsDto })
  create(@Param("panchangId") panchangId: string, @Body() dto: CreatePanchangStatisticsDto) {
    return this.service.createStatistics(panchangId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update panchang statistics" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: UpdatePanchangStatisticsDto })
  update(@Param("panchangId") panchangId: string, @Body() dto: UpdatePanchangStatisticsDto) {
    return this.service.updateStatistics(panchangId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Archive panchang statistics" })
  @ApiParam({ name: "panchangId", type: String })
  remove(@Param("panchangId") panchangId: string) {
    return this.service.archiveStatistics(panchangId);
  }

  @Patch("restore")
  @ApiOperation({ summary: "Restore panchang statistics" })
  @ApiParam({ name: "panchangId", type: String })
  restore(@Param("panchangId") panchangId: string) {
    return this.service.restoreStatistics(panchangId);
  }

  @Patch("status")
  @ApiOperation({ summary: "Update panchang statistics status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: UpdatePanchangStatisticsStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Body() dto: UpdatePanchangStatisticsStatusDto,
  ) {
    return this.service.updateStatus(panchangId, dto.status);
  }
}
