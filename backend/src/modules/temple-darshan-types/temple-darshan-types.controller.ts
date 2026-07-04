import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateTempleDarshanTypeDto,
  TempleDarshanTypeQueryDto,
  TempleDarshanTypeResponseDto,
  UpdateTempleDarshanTypeDto,
  UpdateTempleDarshanTypeStatusDto,
} from "./dto/temple-darshan-type.dto";
import { TempleDarshanTypesService } from "./temple-darshan-types.service";

@ApiTags("Temple Darshan Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/darshan-types")
export class TempleDarshanTypesController {
  constructor(private readonly service: TempleDarshanTypesService) {}

  @Get()
  @ApiOperation({ summary: "List temple darshan types" })
  @ApiPaginatedResponse(TempleDarshanTypeResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleDarshanTypeQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple darshan type by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple darshan type" })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleDarshanTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple darshan type" })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleDarshanTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple darshan type" })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple darshan type" })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple darshan type status" })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleDarshanTypeStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
