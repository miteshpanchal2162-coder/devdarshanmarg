import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateTempleStatisticsDto,
  UpdateTempleStatisticsDto,
  UpdateTempleStatisticsStatusDto,
} from "./dto/temple-statistics.dto";
import { TempleStatisticsService } from "./temple-statistics.service";

@ApiTags("Temple Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/statistics")
export class TempleStatisticsController {
  constructor(private readonly service: TempleStatisticsService) {}

  @Get()
  @ApiOperation({ summary: "Get temple statistics" })
  findByTemple(@Param("templeId") templeId: string) {
    return this.service.findByTemple(templeId);
  }

  @Post()
  @ApiOperation({ summary: "Create temple statistics" })
  create(
    @Param("templeId") templeId: string,
    @Body() dto: CreateTempleStatisticsDto,
    @Req() _request: { user: AuthUser },
  ) {
    return this.service.createStatistics(templeId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update temple statistics" })
  update(
    @Param("templeId") templeId: string,
    @Body() dto: UpdateTempleStatisticsDto,
    @Req() _request: { user: AuthUser },
  ) {
    return this.service.updateStatistics(templeId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Archive temple statistics" })
  remove(@Param("templeId") templeId: string) {
    return this.service.archiveStatistics(templeId);
  }

  @Patch("restore")
  @ApiOperation({ summary: "Restore temple statistics" })
  restore(@Param("templeId") templeId: string) {
    return this.service.restoreStatistics(templeId);
  }

  @Patch("status")
  @ApiOperation({ summary: "Update temple statistics status" })
  updateStatus(
    @Param("templeId") templeId: string,
    @Body() dto: UpdateTempleStatisticsStatusDto,
  ) {
    return this.service.updateStatus(templeId, dto.status);
  }
}
