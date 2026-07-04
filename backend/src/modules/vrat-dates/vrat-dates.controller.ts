import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateVratDateDto,
  UpdateVratDateDto,
  VratDateQueryDto,
  VratDateResponseDto,
} from "./dto/vrat-date.dto";
import { VratDatesService } from "./vrat-dates.service";

@ApiTags("Vrat Dates")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("vrats/:vratId/dates")
export class VratDatesController {
  constructor(private readonly service: VratDatesService) {}

  @Get()
  @ApiOperation({ summary: "List vrat dates" })
  @ApiParam({ name: "vratId", type: String })
  @ApiPaginatedResponse(VratDateResponseDto)
  findAll(@Param("vratId") vratId: string, @Query() query: VratDateQueryDto) {
    return this.service.findByVrat(vratId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vrat date by ID" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("vratId") vratId: string, @Param("id") id: string) {
    return this.service.findChildById(vratId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create vrat date" })
  @ApiParam({ name: "vratId", type: String })
  @ApiBody({ type: CreateVratDateDto })
  create(
    @Param("vratId") vratId: string,
    @Body() dto: CreateVratDateDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(vratId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update vrat date" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateVratDateDto })
  update(
    @Param("vratId") vratId: string,
    @Param("id") id: string,
    @Body() dto: UpdateVratDateDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(vratId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete vrat date" })
  @ApiParam({ name: "vratId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("vratId") vratId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(vratId, id, request.user.id);
  }
}
