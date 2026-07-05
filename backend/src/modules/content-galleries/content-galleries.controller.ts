import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentGalleryQueryDto,
  ContentGalleryResponseDto,
  CreateContentGalleryDto,
  UpdateContentGalleryDto,
  UpdateContentGalleryStatusDto,
} from "./dto/content-gallery.dto";
import { ContentGalleriesService } from "./content-galleries.service";

@ApiTags("Content Galleries")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/galleries")
export class ContentGalleriesController {
  constructor(private readonly service: ContentGalleriesService) {}

  @Get()
  @ApiOperation({ summary: "List content galleries" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentGalleryResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentGalleryQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content gallery by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content gallery" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentGalleryDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Body() dto: CreateContentGalleryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(contentItemId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content gallery" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentGalleryDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentGalleryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(contentItemId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content gallery" })
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
  @ApiOperation({ summary: "Restore content gallery" })
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
  @ApiOperation({ summary: "Update content gallery status" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentGalleryStatusDto })
  updateStatus(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentGalleryStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(contentItemId, id, dto.status, request.user.id);
  }
}
