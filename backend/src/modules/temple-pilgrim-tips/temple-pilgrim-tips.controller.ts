import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTemplePilgrimTipDto, TemplePilgrimTipQueryDto, TemplePilgrimTipResponseDto, UpdateTemplePilgrimTipDto } from "./dto/temple-pilgrim-tip.dto";
import { TemplePilgrimTipsService } from "./temple-pilgrim-tips.service";

@ApiTags("Temple Pilgrim Tips")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/pilgrim-tips")
export class TemplePilgrimTipsController {
  constructor(private readonly service: TemplePilgrimTipsService) {}

  @Get()
  @ApiOperation({ summary: "List temple pilgrim tips" })
  @ApiParam({ name: "templeId", type: String })
  @ApiPaginatedResponse(TemplePilgrimTipResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TemplePilgrimTipQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple pilgrim tip by ID" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple pilgrim tip" })
  @ApiParam({ name: "templeId", type: String })
  @ApiBody({ type: CreateTemplePilgrimTipDto })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTemplePilgrimTipDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple pilgrim tip" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTemplePilgrimTipDto })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTemplePilgrimTipDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple pilgrim tip" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }
}
