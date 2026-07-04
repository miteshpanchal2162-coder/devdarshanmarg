import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityRelationDto,
  DeityRelationQueryDto,
  DeityRelationResponseDto,
  UpdateDeityRelationDto,
} from "./dto/deity-relation.dto";
import { DeityRelationsService } from "./deity-relations.service";

@ApiTags("Deity Relations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/relations")
export class DeityRelationsController {
  constructor(private readonly service: DeityRelationsService) {}

  @Get()
  @ApiOperation({ summary: "List deity relations" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityRelationResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityRelationQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity relation by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity relation" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityRelationDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityRelationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity relation" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityRelationDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityRelationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity relation" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }
}
