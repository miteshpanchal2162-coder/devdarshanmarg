import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateSupportedMediaTypeDto,
  SupportedMediaTypeQueryDto,
  SupportedMediaTypeResponseDto,
  UpdateSupportedMediaTypeDto,
  UpdateSupportedMediaTypeStatusDto,
} from "./dto/supported-media-type.dto";
import { SupportedMediaTypesService } from "./supported-media-types.service";

@ApiTags("Supported Media Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("supported-media-types")
export class SupportedMediaTypesController {
  constructor(private readonly service: SupportedMediaTypesService) {}

  @Get()
  @ApiOperation({ summary: "List supported media types" })
  @ApiPaginatedResponse(SupportedMediaTypeResponseDto)
  findAll(@Query() query: SupportedMediaTypeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get supported media type by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create supported media type" })
  @ApiBody({ type: CreateSupportedMediaTypeDto })
  create(@Body() dto: CreateSupportedMediaTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.createMediaType(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update supported media type" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSupportedMediaTypeDto })
  update(@Param("id") id: string, @Body() dto: UpdateSupportedMediaTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.updateMediaType(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete supported media type" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteMediaType(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore supported media type" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreMediaType(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update supported media type status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSupportedMediaTypeStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateSupportedMediaTypeStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
