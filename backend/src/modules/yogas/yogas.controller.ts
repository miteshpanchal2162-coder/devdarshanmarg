import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateYogaDto,
  UpdateYogaDto,
  UpdateYogaStatusDto,
  YogaQueryDto,
  YogaResponseDto,
} from "./dto/yoga.dto";
import { YogasService } from "./yogas.service";

@ApiTags("Yogas")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("yogas")
export class YogasController {
  constructor(private readonly service: YogasService) {}

  @Get()
  @ApiOperation({ summary: "List yogas" })
  @ApiPaginatedResponse(YogaResponseDto)
  findAll(@Query() query: YogaQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get yoga by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create yoga" })
  @ApiBody({ type: CreateYogaDto })
  create(@Body() dto: CreateYogaDto, @Req() request: { user: AuthUser }) {
    return this.service.createYoga(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update yoga" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateYogaDto })
  update(@Param("id") id: string, @Body() dto: UpdateYogaDto, @Req() request: { user: AuthUser }) {
    return this.service.updateYoga(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete yoga" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteYoga(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore yoga" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreYoga(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update yoga status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateYogaStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateYogaStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
