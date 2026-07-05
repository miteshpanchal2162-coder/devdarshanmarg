import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  ContentAttachmentQueryDto,
  ContentAttachmentResponseDto,
  CreateContentAttachmentDto,
  UpdateContentAttachmentDto,
  UpdateContentAttachmentStatusDto,
} from "./dto/content-attachment.dto";
import { ContentAttachmentsService } from "./content-attachments.service";

@ApiTags("Content Attachments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/attachments")
export class ContentAttachmentsController {
  constructor(private readonly service: ContentAttachmentsService) {}

  @Get()
  @ApiOperation({ summary: "List content attachments" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiPaginatedResponse(ContentAttachmentResponseDto)
  findAll(@Param("contentItemId") contentItemId: string, @Query() query: ContentAttachmentQueryDto) {
    return this.service.findByContentItem(contentItemId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content attachment by ID" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("contentItemId") contentItemId: string, @Param("id") id: string) {
    return this.service.findChildById(contentItemId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create content attachment" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentAttachmentDto })
  create(
    @Param("contentItemId") contentItemId: string,
    @Body() dto: CreateContentAttachmentDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(contentItemId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content attachment" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentAttachmentDto })
  update(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentAttachmentDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(contentItemId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete content attachment" })
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
  @ApiOperation({ summary: "Restore content attachment" })
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
  @ApiOperation({ summary: "Update content attachment status" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentAttachmentStatusDto })
  updateStatus(
    @Param("contentItemId") contentItemId: string,
    @Param("id") id: string,
    @Body() dto: UpdateContentAttachmentStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(contentItemId, id, dto.status, request.user.id);
  }
}
