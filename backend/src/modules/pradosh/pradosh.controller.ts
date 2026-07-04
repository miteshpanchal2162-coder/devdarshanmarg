import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePradoshDto,
  PradoshQueryDto,
  PradoshResponseDto,
  UpdatePradoshDto,
  UpdatePradoshStatusDto,
} from "./dto/pradosh.dto";
import { PradoshService } from "./pradosh.service";

@ApiTags("Pradosh")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/pradosh")
export class PradoshController {
  constructor(private readonly service: PradoshService) {}

  @Get()
  @ApiOperation({ summary: "List pradosh entries" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiPaginatedResponse(PradoshResponseDto)
  findAll(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Query() query: PradoshQueryDto,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get pradosh by ID" })
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
  @ApiOperation({ summary: "Create pradosh" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreatePradoshDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreatePradoshDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, panchangDateId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update pradosh" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePradoshDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePradoshDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, panchangDateId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete pradosh" })
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
  @ApiOperation({ summary: "Update pradosh status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePradoshStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePradoshStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(panchangId, panchangDateId, id, dto.status, request.user.id);
  }
}
