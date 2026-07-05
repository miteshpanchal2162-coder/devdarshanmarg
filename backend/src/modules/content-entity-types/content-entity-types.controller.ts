import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentEntityTypeQueryDto,
  ContentEntityTypeResponseDto,
  CreateContentEntityTypeDto,
  UpdateContentEntityTypeDto,
  UpdateContentEntityTypeStatusDto,
} from "./dto/content-entity-type.dto";
import { ContentEntityTypesService } from "./content-entity-types.service";

@ApiTags("Content Entity Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-entity-types")
export class ContentEntityTypesController {
  constructor(private readonly service: ContentEntityTypesService) {}

  @Get()
  @ApiOperation({ summary: "List content entity types" })
  @ApiPaginatedResponse(ContentEntityTypeResponseDto)
  findAll(@Query() query: ContentEntityTypeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content entity type by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content entity type" })
  @ApiBody({ type: CreateContentEntityTypeDto })
  create(@Body() dto: CreateContentEntityTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.createType(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content entity type" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentEntityTypeDto })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateContentEntityTypeDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateType(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content entity type" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteType(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore content entity type" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreType(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update content entity type status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentEntityTypeStatusDto })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateContentEntityTypeStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
