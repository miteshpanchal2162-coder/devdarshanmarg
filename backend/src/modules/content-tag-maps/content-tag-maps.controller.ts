import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentTagMapQueryDto,
  ContentTagMapResponseDto,
  CreateContentTagMapDto,
  UpdateContentTagMapDto,
} from "./dto/content-tag-map.dto";
import { ContentTagMapsService } from "./content-tag-maps.service";

@ApiTags("Content Tag Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/tag-maps")
export class ContentTagMapsController {
  constructor(private readonly service: ContentTagMapsService) {}

  @Get()
  @ApiOperation({ summary: "List content tag maps" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentTagMapResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentTagMapQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content tag map by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content tag map" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentTagMapDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Body() dto: CreateContentTagMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(contentItemId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content tag map" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentTagMapDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentTagMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(contentItemId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content tag map" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.deleteChild(contentItemId, id, request.user.id);
  }
}
