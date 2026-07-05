import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentVersionQueryDto,
  ContentVersionResponseDto,
  CreateContentVersionDto,
  UpdateContentVersionDto,
} from "./dto/content-version.dto";
import { ContentVersionsService } from "./content-versions.service";

@ApiTags("Content Versions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/versions")
export class ContentVersionsController {
  constructor(private readonly service: ContentVersionsService) {}

  @Get()
  @ApiOperation({ summary: "List content versions" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentVersionResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentVersionQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content version by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content version" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentVersionDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Body() dto: CreateContentVersionDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(contentItemId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content version" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentVersionDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentVersionDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(contentItemId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content version" })
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
