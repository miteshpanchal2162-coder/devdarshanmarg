import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleQrCodeDto, TempleQrCodeQueryDto, TempleQrCodeResponseDto, UpdateTempleQrCodeDto, UpdateTempleQrCodeStatusDto } from "./dto/temple-qr-code.dto";
import { TempleQrCodesService } from "./temple-qr-codes.service";

@ApiTags("Temple QR Codes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/qr-codes")
export class TempleQrCodesController {
  constructor(private readonly service: TempleQrCodesService) {}

  @Get()
  @ApiOperation({ summary: "List temple QR codes" })
  @ApiParam({ name: "templeId", type: String })
  @ApiPaginatedResponse(TempleQrCodeResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleQrCodeQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple QR code by ID" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple QR code" })
  @ApiParam({ name: "templeId", type: String })
  @ApiBody({ type: CreateTempleQrCodeDto })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleQrCodeDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple QR code" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleQrCodeDto })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleQrCodeDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple QR code" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple QR code" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple QR code status" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleQrCodeStatusDto })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleQrCodeStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
