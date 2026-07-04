import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateTithiDto,
  TithiQueryDto,
  TithiResponseDto,
  UpdateTithiDto,
  UpdateTithiStatusDto,
} from "./dto/tithi.dto";
import { TithisService } from "./tithis.service";

@ApiTags("Tithis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("tithis")
export class TithisController {
  constructor(private readonly service: TithisService) {}

  @Get()
  @ApiOperation({ summary: "List tithis" })
  @ApiPaginatedResponse(TithiResponseDto)
  findAll(@Query() query: TithiQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get tithi by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create tithi" })
  @ApiBody({ type: CreateTithiDto })
  create(@Body() dto: CreateTithiDto, @Req() request: { user: AuthUser }) {
    return this.service.createTithi(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update tithi" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTithiDto })
  update(@Param("id") id: string, @Body() dto: UpdateTithiDto, @Req() request: { user: AuthUser }) {
    return this.service.updateTithi(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete tithi" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteTithi(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore tithi" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreTithi(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update tithi status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTithiStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateTithiStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
