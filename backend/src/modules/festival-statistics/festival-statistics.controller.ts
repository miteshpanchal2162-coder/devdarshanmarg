import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateFestivalStatisticsDto,
  UpdateFestivalStatisticsDto,
  UpdateFestivalStatisticsStatusDto,
} from "./dto/festival-statistics.dto";
import { FestivalStatisticsService } from "./festival-statistics.service";

@ApiTags("Festival Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/statistics")
export class FestivalStatisticsController {
  constructor(private readonly service: FestivalStatisticsService) {}

  @Get()
  @ApiOperation({ summary: "Get festival statistics" })
  @ApiParam({ name: "festivalId", type: String })
  findByFestival(@Param("festivalId") festivalId: string) {
    return this.service.findByFestival(festivalId);
  }

  @Post()
  @ApiOperation({ summary: "Create festival statistics" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalStatisticsDto })
  create(@Param("festivalId") festivalId: string, @Body() dto: CreateFestivalStatisticsDto) {
    return this.service.createStatistics(festivalId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update festival statistics" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: UpdateFestivalStatisticsDto })
  update(@Param("festivalId") festivalId: string, @Body() dto: UpdateFestivalStatisticsDto) {
    return this.service.updateStatistics(festivalId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Archive festival statistics" })
  @ApiParam({ name: "festivalId", type: String })
  remove(@Param("festivalId") festivalId: string) {
    return this.service.archiveStatistics(festivalId);
  }

  @Patch("restore")
  @ApiOperation({ summary: "Restore festival statistics" })
  @ApiParam({ name: "festivalId", type: String })
  restore(@Param("festivalId") festivalId: string) {
    return this.service.restoreStatistics(festivalId);
  }

  @Patch("status")
  @ApiOperation({ summary: "Update festival statistics status" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: UpdateFestivalStatisticsStatusDto })
  updateStatus(
    @Param("festivalId") festivalId: string,
    @Body() dto: UpdateFestivalStatisticsStatusDto,
  ) {
    return this.service.updateStatus(festivalId, dto.status);
  }
}
