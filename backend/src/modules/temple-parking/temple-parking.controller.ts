import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleParkingDto, TempleParkingQueryDto, TempleParkingResponseDto, UpdateTempleParkingDto, UpdateTempleParkingStatusDto } from "./dto/temple-parking.dto";
import { TempleParkingService } from "./temple-parking.service";

@ApiTags("Temple Parking")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/parking")
export class TempleParkingController {
  constructor(private readonly service: TempleParkingService) {}

  @Get()
  @ApiOperation({ summary: "List temple parking" })
  @ApiPaginatedResponse(TempleParkingResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleParkingQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple parking by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple parking" })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleParkingDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple parking" })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleParkingDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple parking" })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple parking" })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple parking status" })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleParkingStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
