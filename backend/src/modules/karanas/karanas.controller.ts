import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateKaranaDto,
  KaranaQueryDto,
  KaranaResponseDto,
  UpdateKaranaDto,
  UpdateKaranaStatusDto,
} from "./dto/karana.dto";
import { KaranasService } from "./karanas.service";

@ApiTags("Karanas")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("karanas")
export class KaranasController {
  constructor(private readonly service: KaranasService) {}

  @Get()
  @ApiOperation({ summary: "List karanas" })
  @ApiPaginatedResponse(KaranaResponseDto)
  findAll(@Query() query: KaranaQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get karana by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create karana" })
  @ApiBody({ type: CreateKaranaDto })
  create(@Body() dto: CreateKaranaDto, @Req() request: { user: AuthUser }) {
    return this.service.createKarana(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update karana" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateKaranaDto })
  update(@Param("id") id: string, @Body() dto: UpdateKaranaDto, @Req() request: { user: AuthUser }) {
    return this.service.updateKarana(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete karana" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteKarana(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore karana" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreKarana(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update karana status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateKaranaStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateKaranaStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
