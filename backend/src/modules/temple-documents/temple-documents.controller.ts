import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleDocumentDto, TempleDocumentQueryDto, TempleDocumentResponseDto, UpdateTempleDocumentDto, UpdateTempleDocumentStatusDto } from "./dto/temple-document.dto";
import { TempleDocumentsService } from "./temple-documents.service";

@ApiTags("Temple Documents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/documents")
export class TempleDocumentsController {
  constructor(private readonly service: TempleDocumentsService) {}

  @Get()
  @ApiOperation({ summary: "List temple documents" })
  @ApiPaginatedResponse(TempleDocumentResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleDocumentQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple document by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple document" })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleDocumentDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple document" })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleDocumentDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple document" })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple document" })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple document status" })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleDocumentStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
