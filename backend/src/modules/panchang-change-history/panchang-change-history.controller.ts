import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangChangeHistoryDto,
  PanchangChangeHistoryQueryDto,
  PanchangChangeHistoryResponseDto,
  UpdatePanchangChangeHistoryDto,
} from "./dto/panchang-change-history.dto";
import { PanchangChangeHistoryService } from "./panchang-change-history.service";

@ApiTags("Panchang Change History")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/change-history")
export class PanchangChangeHistoryController {
  constructor(private readonly service: PanchangChangeHistoryService) {}

  @Get()
  @ApiOperation({ summary: "List panchang change history" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiPaginatedResponse(PanchangChangeHistoryResponseDto)
  findAll(@Param("panchangId") panchangId: string, @Query() query: PanchangChangeHistoryQueryDto) {
    return this.service.findByPanchang(panchangId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang change history by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("panchangId") panchangId: string, @Param("id") id: string) {
    return this.service.findChildById(panchangId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang change history" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangChangeHistoryDto })
  create(
    @Param("panchangId") panchangId: string,
    @Body() dto: CreatePanchangChangeHistoryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang change history" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangChangeHistoryDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangChangeHistoryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang change history" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(panchangId, id, request.user.id);
  }
}
