import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleChangeHistoryDto, TempleChangeHistoryQueryDto, TempleChangeHistoryResponseDto, UpdateTempleChangeHistoryDto } from "./dto/temple-change-history.dto";
import { TempleChangeHistoryService } from "./temple-change-history.service";

@ApiTags("Temple Change History")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/change-history")
export class TempleChangeHistoryController {
  constructor(private readonly service: TempleChangeHistoryService) {}

  @Get()
  @ApiOperation({ summary: "List temple change history" })
  @ApiParam({ name: "templeId", type: String })
  @ApiPaginatedResponse(TempleChangeHistoryResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleChangeHistoryQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple change history by ID" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple change history" })
  @ApiParam({ name: "templeId", type: String })
  @ApiBody({ type: CreateTempleChangeHistoryDto })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleChangeHistoryDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple change history" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleChangeHistoryDto })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleChangeHistoryDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple change history" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }
}
