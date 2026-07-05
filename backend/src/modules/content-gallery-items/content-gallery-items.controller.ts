import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentGalleryItemQueryDto,
  ContentGalleryItemResponseDto,
  CreateContentGalleryItemDto,
  UpdateContentGalleryItemDto,
} from "./dto/content-gallery-item.dto";
import { ContentGalleryItemsService } from "./content-gallery-items.service";

@ApiTags("Content Gallery Items")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/galleries/:galleryId/items")
export class ContentGalleryItemsController {
  constructor(private readonly service: ContentGalleryItemsService) {}

  @Get()
  @ApiOperation({ summary: "List content gallery items" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "galleryId", type: String })
  @ApiPaginatedResponse(ContentGalleryItemResponseDto)
  findAll(
    @Param("contentItemId") contentItemId: string,
    @Param("galleryId") galleryId: string,
    @Query() query: ContentGalleryItemQueryDto,
  ) {
    return this.service.findByGallery(contentItemId, galleryId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content gallery item by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "galleryId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(
    @Param("contentItemId") contentItemId: string,
    @Param("galleryId") galleryId: string,
    @Param("id") id: string,
  ) {
    return this.service.findChildById(contentItemId, galleryId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content gallery item" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "galleryId", type: String })
  @ApiBody({ type: CreateContentGalleryItemDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Param("galleryId") galleryId: string,
    @Body() dto: CreateContentGalleryItemDto,
  ) {
    return this.service.createChild(contentItemId, galleryId, dto, "");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content gallery item" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "galleryId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentGalleryItemDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("galleryId") galleryId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentGalleryItemDto,
  ) {
    return this.service.updateChild(contentItemId, galleryId, id, dto, "");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content gallery item" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "galleryId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(
    @Param("contentItemId") contentItemId: string,
    @Param("galleryId") galleryId: string,
    @Param("id") id: string,
  ) {
    return this.service.deleteChild(contentItemId, galleryId, id, "");
  }
}
