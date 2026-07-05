import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentTranslationQueryDto,
  ContentTranslationResponseDto,
  CreateContentTranslationDto,
  UpdateContentTranslationDto,
} from "./dto/content-translation.dto";
import { ContentTranslationsService } from "./content-translations.service";

@ApiTags("Content Translations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("contents/:contentId/translations")
export class ContentTranslationsController {
  constructor(private readonly service: ContentTranslationsService) {}

  @Get()
  @ApiOperation({ summary: "List content translations" })
  @ApiParam({ name: "contentId", type: String })
  @ApiPaginatedResponse(ContentTranslationResponseDto)
  findAll(@Param("contentId") contentId: string, @Query() query: ContentTranslationQueryDto) {
    return this.service.findByContent(contentId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content translation by ID" })
  @ApiParam({ name: "contentId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentId") contentId: string, @Param("id") id: string) {
    return this.service.findChildById(contentId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content translation" })
  @ApiParam({ name: "contentId", type: String })
  @ApiBody({ type: CreateContentTranslationDto })
  create(@Param("contentId") contentId: string, @Body() dto: CreateContentTranslationDto) {
    return this.service.createChild(contentId, dto, "");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content translation" })
  @ApiParam({ name: "contentId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentTranslationDto })
  update(
    @Param("contentId") contentId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentTranslationDto,
  ) {
    return this.service.updateChild(contentId, id, dto, "");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content translation" })
  @ApiParam({ name: "contentId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("contentId") contentId: string, @Param("id") id: string) {
    return this.service.deleteChild(contentId, id, "");
  }
}
