import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityChangeHistoryDto,
  DeityChangeHistoryQueryDto,
  DeityChangeHistoryResponseDto,
  UpdateDeityChangeHistoryDto,
} from "./dto/deity-change-history.dto";
import { DeityChangeHistoryService } from "./deity-change-history.service";

@ApiTags("Deity Change History")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/change-history")
export class DeityChangeHistoryController {
  constructor(private readonly service: DeityChangeHistoryService) {}

  @Get()
  @ApiOperation({ summary: "List deity change history" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityChangeHistoryResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityChangeHistoryQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity change history by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity change history" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityChangeHistoryDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityChangeHistoryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity change history" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityChangeHistoryDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityChangeHistoryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity change history" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }
}
