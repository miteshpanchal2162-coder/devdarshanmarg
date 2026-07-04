import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ChoghadiyaQueryDto,
  ChoghadiyaResponseDto,
  CreateChoghadiyaDto,
  UpdateChoghadiyaDto,
} from "./dto/choghadiya.dto";
import { ChoghadiyasService } from "./choghadiyas.service";

@ApiTags("Choghadiyas")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/choghadiyas")
export class ChoghadiyasController {
  constructor(private readonly service: ChoghadiyasService) {}

  @Get()
  @ApiOperation({ summary: "List choghadiyas" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiPaginatedResponse(ChoghadiyaResponseDto)
  findAll(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Query() query: ChoghadiyaQueryDto,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get choghadiya by ID" })
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
  @ApiOperation({ summary: "Create choghadiya" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateChoghadiyaDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateChoghadiyaDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, panchangDateId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update choghadiya" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateChoghadiyaDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdateChoghadiyaDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, panchangDateId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete choghadiya" })
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
}
