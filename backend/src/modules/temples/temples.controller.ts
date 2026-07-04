import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateTempleDto,
  TempleQueryDto,
  TempleResponseDto,
  UpdateTempleDto,
  UpdateTempleStatusDto,
} from "./dto/temple.dto";
import { TemplesService } from "./temples.service";

@ApiTags("Temples")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples")
export class TemplesController {
  constructor(private readonly templesService: TemplesService) {}

  @Get()
  @ApiOperation({ summary: "List temples" })
  @ApiPaginatedResponse(TempleResponseDto)
  findAll(@Query() query: TempleQueryDto) {
    return this.templesService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.templesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple" })
  create(@Body() dto: CreateTempleDto, @Req() request: { user: AuthUser }) {
    return this.templesService.createTemple(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple" })
  update(@Param("id") id: string, @Body() dto: UpdateTempleDto, @Req() request: { user: AuthUser }) {
    return this.templesService.updateTemple(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete temple" })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.templesService.deleteTemple(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple" })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.templesService.restoreTemple(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateTempleStatusDto, @Req() request: { user: AuthUser }) {
    return this.templesService.updateTempleStatus(id, dto.status, request.user.id);
  }
}
