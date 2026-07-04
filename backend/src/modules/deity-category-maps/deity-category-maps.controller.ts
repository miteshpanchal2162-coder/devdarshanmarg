import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityCategoryMapDto,
  DeityCategoryMapQueryDto,
  DeityCategoryMapResponseDto,
  UpdateDeityCategoryMapDto,
} from "./dto/deity-category-map.dto";
import { DeityCategoryMapsService } from "./deity-category-maps.service";

@ApiTags("Deity Category Maps")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/category-maps")
export class DeityCategoryMapsController {
  constructor(private readonly service: DeityCategoryMapsService) {}

  @Get()
  @ApiOperation({ summary: "List deity category maps" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityCategoryMapResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityCategoryMapQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity category map by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity category map" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityCategoryMapDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityCategoryMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity category map" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityCategoryMapDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityCategoryMapDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity category map" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }
}
