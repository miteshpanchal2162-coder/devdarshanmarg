import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangTranslationDto,
  PanchangTranslationQueryDto,
  PanchangTranslationResponseDto,
  UpdatePanchangTranslationDto,
} from "./dto/panchang-translation.dto";
import { PanchangTranslationsService } from "./panchang-translations.service";

@ApiTags("Panchang Translations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/translations")
export class PanchangTranslationsController {
  constructor(private readonly service: PanchangTranslationsService) {}

  @Get()
  @ApiOperation({ summary: "List panchang translations" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiPaginatedResponse(PanchangTranslationResponseDto)
  findAll(@Param("panchangId") panchangId: string, @Query() query: PanchangTranslationQueryDto) {
    return this.service.findByPanchang(panchangId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang translation by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("panchangId") panchangId: string, @Param("id") id: string) {
    return this.service.findChildById(panchangId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang translation" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangTranslationDto })
  create(
    @Param("panchangId") panchangId: string,
    @Body() dto: CreatePanchangTranslationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang translation" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangTranslationDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangTranslationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang translation" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(panchangId, id, request.user.id);
  }
}
