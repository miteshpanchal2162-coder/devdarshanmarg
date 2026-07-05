import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateSupportedLanguageDto,
  SupportedLanguageQueryDto,
  SupportedLanguageResponseDto,
  UpdateSupportedLanguageDto,
  UpdateSupportedLanguageStatusDto,
} from "./dto/supported-language.dto";
import { SupportedLanguagesService } from "./supported-languages.service";

@ApiTags("Supported Languages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("supported-languages")
export class SupportedLanguagesController {
  constructor(private readonly service: SupportedLanguagesService) {}

  @Get()
  @ApiOperation({ summary: "List supported languages" })
  @ApiPaginatedResponse(SupportedLanguageResponseDto)
  findAll(@Query() query: SupportedLanguageQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get supported language by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create supported language" })
  @ApiBody({ type: CreateSupportedLanguageDto })
  create(@Body() dto: CreateSupportedLanguageDto, @Req() request: { user: AuthUser }) {
    return this.service.createLanguage(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update supported language" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSupportedLanguageDto })
  update(@Param("id") id: string, @Body() dto: UpdateSupportedLanguageDto, @Req() request: { user: AuthUser }) {
    return this.service.updateLanguage(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete supported language" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteLanguage(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore supported language" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreLanguage(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update supported language status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSupportedLanguageStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateSupportedLanguageStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateStatus(id, dto.status, request.user.id);
  }
}
