import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTemplePrasadamDto, TemplePrasadamQueryDto, TemplePrasadamResponseDto, UpdateTemplePrasadamDto, UpdateTemplePrasadamStatusDto } from "./dto/temple-prasadam.dto";
import { TemplePrasadamsService } from "./temple-prasadams.service";

@ApiTags("Temple Prasadams")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/prasadams")
export class TemplePrasadamsController {
  constructor(private readonly service: TemplePrasadamsService) {}

  @Get()
  @ApiOperation({ summary: "List temple prasadams" })
  @ApiPaginatedResponse(TemplePrasadamResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TemplePrasadamQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple prasadam by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple prasadam" })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTemplePrasadamDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple prasadam" })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTemplePrasadamDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple prasadam" })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple prasadam" })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple prasadam status" })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTemplePrasadamStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
