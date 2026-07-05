import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentItemQueryDto,
  ContentItemResponseDto,
  CreateContentItemDto,
  UpdateContentItemDto,
  UpdateContentItemStatusDto,
} from "./dto/content-item.dto";
import { ContentItemsService } from "./content-items.service";

@ApiTags("Content Items")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items")
export class ContentItemsController {
  constructor(private readonly service: ContentItemsService) {}

  @Get()
  @ApiOperation({ summary: "List content items" })
  @ApiPaginatedResponse(ContentItemResponseDto)
  findAll(@Query() query: ContentItemQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content item by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content item" })
  @ApiBody({ type: CreateContentItemDto })
  create(@Body() dto: CreateContentItemDto, @Req() request: { user: AuthUser }) {
    return this.service.createContentItem(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content item" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentItemDto })
  update(@Param("id") id: string, @Body() dto: UpdateContentItemDto, @Req() request: { user: AuthUser }) {
    return this.service.updateContentItem(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content item" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteContentItem(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore content item" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreContentItem(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update content item status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentItemStatusDto })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateContentItemStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
