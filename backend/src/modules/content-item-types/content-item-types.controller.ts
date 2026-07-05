import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentItemTypeQueryDto,
  ContentItemTypeResponseDto,
  CreateContentItemTypeDto,
  UpdateContentItemTypeDto,
  UpdateContentItemTypeStatusDto,
} from "./dto/content-item-type.dto";
import { ContentItemTypesService } from "./content-item-types.service";

@ApiTags("Content Item Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-item-types")
export class ContentItemTypesController {
  constructor(private readonly service: ContentItemTypesService) {}

  @Get()
  @ApiOperation({ summary: "List content item types" })
  @ApiPaginatedResponse(ContentItemTypeResponseDto)
  findAll(@Query() query: ContentItemTypeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content item type by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content item type" })
  @ApiBody({ type: CreateContentItemTypeDto })
  create(@Body() dto: CreateContentItemTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.createType(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content item type" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentItemTypeDto })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateContentItemTypeDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateType(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content item type" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteType(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore content item type" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreType(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update content item type status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentItemTypeStatusDto })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateContentItemTypeStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
