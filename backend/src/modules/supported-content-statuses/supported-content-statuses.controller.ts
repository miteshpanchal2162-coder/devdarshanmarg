import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateSupportedContentStatusDto,
  SupportedContentStatusQueryDto,
  SupportedContentStatusResponseDto,
  UpdateSupportedContentStatusDto,
  UpdateSupportedContentStatusStatusDto,
} from "./dto/supported-content-status.dto";
import { SupportedContentStatusesService } from "./supported-content-statuses.service";

@ApiTags("Supported Content Statuses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("supported-content-statuses")
export class SupportedContentStatusesController {
  constructor(private readonly service: SupportedContentStatusesService) {}

  @Get()
  @ApiOperation({ summary: "List supported content statuses" })
  @ApiPaginatedResponse(SupportedContentStatusResponseDto)
  findAll(@Query() query: SupportedContentStatusQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get supported content status by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create supported content status" })
  @ApiBody({ type: CreateSupportedContentStatusDto })
  create(@Body() dto: CreateSupportedContentStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.createContentStatus(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update supported content status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSupportedContentStatusDto })
  update(@Param("id") id: string, @Body() dto: UpdateSupportedContentStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateContentStatus(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete supported content status" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteContentStatus(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore supported content status" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreContentStatus(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update supported content status status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSupportedContentStatusStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateSupportedContentStatusStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
