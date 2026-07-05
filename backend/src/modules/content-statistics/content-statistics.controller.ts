import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentStatisticsResponseDto,
  CreateContentStatisticsDto,
  UpdateContentStatisticsDto,
} from "./dto/content-statistics.dto";
import { ContentStatisticsService } from "./content-statistics.service";

@ApiTags("Content Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/statistics")
export class ContentStatisticsController {
  constructor(private readonly service: ContentStatisticsService) {}

  @Get()
  @ApiOperation({ summary: "Get content statistics" })
  @ApiParam({ name: "contentItemId", type: String })
  findByContentItem(@Param("contentItemId") contentItemId: string) {
    return this.service.findByContentItem(contentItemId);
  }

  @Post()
  @ApiOperation({ summary: "Create content statistics" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentStatisticsDto })
  create(@Param("contentItemId") contentItemId: string, @Body() dto: CreateContentStatisticsDto) {
    return this.service.createStatistics(contentItemId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update content statistics" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: UpdateContentStatisticsDto })
  update(@Param("contentItemId") contentItemId: string, @Body() dto: UpdateContentStatisticsDto) {
    return this.service.updateStatistics(contentItemId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete content statistics" })
  @ApiParam({ name: "contentItemId", type: String })
  remove(@Param("contentItemId") contentItemId: string) {
    return this.service.deleteStatistics(contentItemId);
  }
}
