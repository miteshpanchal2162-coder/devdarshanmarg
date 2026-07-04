import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateDeityStatisticsDto,
  UpdateDeityStatisticsDto,
  UpdateDeityStatisticsStatusDto,
} from "./dto/deity-statistics.dto";
import { DeityStatisticsService } from "./deity-statistics.service";

@ApiTags("Deity Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/statistics")
export class DeityStatisticsController {
  constructor(private readonly service: DeityStatisticsService) {}

  @Get()
  @ApiOperation({ summary: "Get deity statistics" })
  @ApiParam({ name: "deityId", type: String })
  findByDeity(@Param("deityId") deityId: string) {
    return this.service.findByDeity(deityId);
  }

  @Post()
  @ApiOperation({ summary: "Create deity statistics" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityStatisticsDto })
  create(@Param("deityId") deityId: string, @Body() dto: CreateDeityStatisticsDto) {
    return this.service.createStatistics(deityId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update deity statistics" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: UpdateDeityStatisticsDto })
  update(@Param("deityId") deityId: string, @Body() dto: UpdateDeityStatisticsDto) {
    return this.service.updateStatistics(deityId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Archive deity statistics" })
  @ApiParam({ name: "deityId", type: String })
  remove(@Param("deityId") deityId: string) {
    return this.service.archiveStatistics(deityId);
  }

  @Patch("restore")
  @ApiOperation({ summary: "Restore deity statistics" })
  @ApiParam({ name: "deityId", type: String })
  restore(@Param("deityId") deityId: string) {
    return this.service.restoreStatistics(deityId);
  }

  @Patch("status")
  @ApiOperation({ summary: "Update deity statistics status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: UpdateDeityStatisticsStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Body() dto: UpdateDeityStatisticsStatusDto,
  ) {
    return this.service.updateStatus(deityId, dto.status);
  }
}
