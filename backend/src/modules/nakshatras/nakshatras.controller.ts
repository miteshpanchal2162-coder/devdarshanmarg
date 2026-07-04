import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateNakshatraDto,
  NakshatraQueryDto,
  NakshatraResponseDto,
  UpdateNakshatraDto,
  UpdateNakshatraStatusDto,
} from "./dto/nakshatra.dto";
import { NakshatrasService } from "./nakshatras.service";

@ApiTags("Nakshatras")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("nakshatras")
export class NakshatrasController {
  constructor(private readonly service: NakshatrasService) {}

  @Get()
  @ApiOperation({ summary: "List nakshatras" })
  @ApiPaginatedResponse(NakshatraResponseDto)
  findAll(@Query() query: NakshatraQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get nakshatra by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create nakshatra" })
  @ApiBody({ type: CreateNakshatraDto })
  create(@Body() dto: CreateNakshatraDto, @Req() request: { user: AuthUser }) {
    return this.service.createNakshatra(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update nakshatra" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateNakshatraDto })
  update(@Param("id") id: string, @Body() dto: UpdateNakshatraDto, @Req() request: { user: AuthUser }) {
    return this.service.updateNakshatra(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete nakshatra" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteNakshatra(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore nakshatra" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreNakshatra(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update nakshatra status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateNakshatraStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateNakshatraStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
