import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentMediaQueryDto,
  ContentMediaResponseDto,
  CreateContentMediaDto,
  UpdateContentMediaDto,
  UpdateContentMediaStatusDto,
} from "./dto/content-media.dto";
import { ContentMediaService } from "./content-media.service";

@ApiTags("Content Media")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/media")
export class ContentMediaController {
  constructor(private readonly service: ContentMediaService) {}

  @Get()
  @ApiOperation({ summary: "List content media" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentMediaResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentMediaQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content media by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content media" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentMediaDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Body() dto: CreateContentMediaDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(contentItemId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content media" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentMediaDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentMediaDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(contentItemId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content media" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.deleteChild(contentItemId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore content media" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.restoreChild(contentItemId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update content media status" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentMediaStatusDto })
  updateStatus(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentMediaStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(contentItemId, id, dto.status, request.user.id);
  }
}
