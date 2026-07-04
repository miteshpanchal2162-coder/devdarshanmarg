import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityTypeDto,
  DeityTypeQueryDto,
  DeityTypeResponseDto,
  UpdateDeityTypeDto,
  UpdateDeityTypeStatusDto,
} from "./dto/deity-type.dto";
import { DeityTypesService } from "./deity-types.service";

@ApiTags("Deity Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deity-types")
export class DeityTypesController {
  constructor(private readonly service: DeityTypesService) {}

  @Get()
  @ApiOperation({ summary: "List deity types" })
  @ApiPaginatedResponse(DeityTypeResponseDto)
  findAll(@Query() query: DeityTypeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity type by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity type" })
  @ApiBody({ type: CreateDeityTypeDto })
  create(@Body() dto: CreateDeityTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.createType(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity type" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityTypeDto })
  update(@Param("id") id: string, @Body() dto: UpdateDeityTypeDto, @Req() request: { user: AuthUser }) {
    return this.service.updateType(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete deity type" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteType(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore deity type" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreType(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update deity type status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityTypeStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateDeityTypeStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
