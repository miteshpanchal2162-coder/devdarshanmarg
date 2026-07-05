import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentEntityMapQueryDto,
  ContentEntityMapResponseDto,
  CreateContentEntityMapDto,
  UpdateContentEntityMapDto,
  UpdateContentEntityMapStatusDto,
} from "./dto/content-entity-map.dto";
import { ContentEntityMapsService } from "./content-entity-maps.service";

@ApiTags("Content Entity Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/entity-maps")
export class ContentEntityMapsController {
  constructor(private readonly service: ContentEntityMapsService) {}

  @Get()
  @ApiOperation({ summary: "List content entity maps" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentEntityMapResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentEntityMapQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content entity map by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content entity map" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentEntityMapDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Body() dto: CreateContentEntityMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(contentItemId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content entity map" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentEntityMapDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentEntityMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(contentItemId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content entity map" })
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
  @ApiOperation({ summary: "Restore content entity map" })
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
  @ApiOperation({ summary: "Update content entity map status" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentEntityMapStatusDto })
  updateStatus(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentEntityMapStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(contentItemId, id, dto.status, request.user.id);
  }
}
