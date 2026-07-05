import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentItemTranslationQueryDto,
  ContentItemTranslationResponseDto,
  CreateContentItemTranslationDto,
  UpdateContentItemTranslationDto,
} from "./dto/content-item-translation.dto";
import { ContentItemTranslationsService } from "./content-item-translations.service";

@ApiTags("Content Item Translations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/translations")
export class ContentItemTranslationsController {
  constructor(private readonly service: ContentItemTranslationsService) {}

  @Get()
  @ApiOperation({ summary: "List content item translations" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentItemTranslationResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentItemTranslationQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content item translation by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content item translation" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentItemTranslationDto })
  create(@Param("contentItemId") contentItemId: string, @Body() dto: CreateContentItemTranslationDto) {
    return this.service.createChild(contentItemId, dto, "");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content item translation" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentItemTranslationDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentItemTranslationDto,
  ) {
    return this.service.updateChild(contentItemId, id, dto, "");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content item translation" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.deleteChild(contentItemId, id, "");
  }
}
