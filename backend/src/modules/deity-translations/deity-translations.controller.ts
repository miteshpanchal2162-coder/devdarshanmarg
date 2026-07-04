import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityTranslationDto,
  DeityTranslationQueryDto,
  DeityTranslationResponseDto,
  UpdateDeityTranslationDto,
} from "./dto/deity-translation.dto";
import { DeityTranslationsService } from "./deity-translations.service";

@ApiTags("Deity Translations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/translations")
export class DeityTranslationsController {
  constructor(private readonly service: DeityTranslationsService) {}

  @Get()
  @ApiOperation({ summary: "List deity translations" })
  @ApiParam({ name: "deityId", type: String })
  @ApiPaginatedResponse(DeityTranslationResponseDto)
  findAll(@Param("deityId") deityId: string, @Query() query: DeityTranslationQueryDto) {
    return this.service.findByDeity(deityId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get deity translation by ID" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("deityId") deityId: string, @Param("id") id: string) {
    return this.service.findChildById(deityId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create deity translation" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityTranslationDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityTranslationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(deityId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deity translation" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDeityTranslationDto })
  update(
    @Param("deityId") deityId: string,
    @Param("id") id: string,
    @Body() dto: UpdateDeityTranslationDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(deityId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete deity translation" })
  @ApiParam({ name: "deityId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("deityId") deityId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(deityId, id, request.user.id);
  }
}
