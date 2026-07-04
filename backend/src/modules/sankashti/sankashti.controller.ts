import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateSankashtiDto,
  SankashtiQueryDto,
  SankashtiResponseDto,
  UpdateSankashtiDto,
  UpdateSankashtiStatusDto,
} from "./dto/sankashti.dto";
import { SankashtiService } from "./sankashti.service";

@ApiTags("Sankashti")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/sankashti")
export class SankashtiController {
  constructor(private readonly service: SankashtiService) {}

  @Get()
  @ApiOperation({ summary: "List sankashti entries" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiPaginatedResponse(SankashtiResponseDto)
  findAll(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Query() query: SankashtiQueryDto,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get sankashti by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
  ) {
    return this.service.findChildById(panchangId, panchangDateId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create sankashti" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateSankashtiDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateSankashtiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, panchangDateId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update sankashti" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSankashtiDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdateSankashtiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, panchangDateId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete sankashti" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.deleteChild(panchangId, panchangDateId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update sankashti status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSankashtiStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdateSankashtiStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(panchangId, panchangDateId, id, dto.status, request.user.id);
  }
}
