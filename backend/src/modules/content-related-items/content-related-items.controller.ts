import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentRelatedItemQueryDto,
  ContentRelatedItemResponseDto,
  CreateContentRelatedItemDto,
  UpdateContentRelatedItemDto,
} from "./dto/content-related-item.dto";
import { ContentRelatedItemsService } from "./content-related-items.service";

@ApiTags("Content Related Items")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/related-items")
export class ContentRelatedItemsController {
  constructor(private readonly service: ContentRelatedItemsService) {}

  @Get()
  @ApiOperation({ summary: "List content related items" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentRelatedItemResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentRelatedItemQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content related item by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content related item" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentRelatedItemDto })
  create(@Param("contentItemId") contentItemId: string, @Body() dto: CreateContentRelatedItemDto) {
    return this.service.createChild(contentItemId, dto, "");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content related item" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentRelatedItemDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentRelatedItemDto,
  ) {
    return this.service.updateChild(contentItemId, id, dto, "");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content related item" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.deleteChild(contentItemId, id, "");
  }
}
