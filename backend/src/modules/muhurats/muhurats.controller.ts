import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateMuhuratDto,
  MuhuratQueryDto,
  MuhuratResponseDto,
  UpdateMuhuratDto,
  UpdateMuhuratStatusDto,
} from "./dto/muhurat.dto";
import { MuhuratsService } from "./muhurats.service";

@ApiTags("Muhurats")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("muhurats")
export class MuhuratsController {
  constructor(private readonly service: MuhuratsService) {}

  @Get()
  @ApiOperation({ summary: "List muhurats" })
  @ApiPaginatedResponse(MuhuratResponseDto)
  findAll(@Query() query: MuhuratQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get muhurat by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create muhurat" })
  @ApiBody({ type: CreateMuhuratDto })
  create(@Body() dto: CreateMuhuratDto, @Req() request: { user: AuthUser }) {
    return this.service.createMuhurat(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update muhurat" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateMuhuratDto })
  update(@Param("id") id: string, @Body() dto: UpdateMuhuratDto, @Req() request: { user: AuthUser }) {
    return this.service.updateMuhurat(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete muhurat" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteMuhurat(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore muhurat" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreMuhurat(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update muhurat status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateMuhuratStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateMuhuratStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
