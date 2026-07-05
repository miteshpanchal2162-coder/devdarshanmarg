import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentTypeQueryDto,
  ContentTypeResponseDto,
  CreateContentTypeDto,
  UpdateContentTypeDto,
} from "./dto/content-type.dto";
import { ContentTypesService } from "./content-types.service";

@ApiTags("Content Types")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-types")
export class ContentTypesController {
  constructor(private readonly service: ContentTypesService) {}

  @Get()
  @ApiOperation({ summary: "List content types" })
  @ApiPaginatedResponse(ContentTypeResponseDto)
  findAll(@Query() query: ContentTypeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content type by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content type" })
  @ApiBody({ type: CreateContentTypeDto })
  create(@Body() dto: CreateContentTypeDto) {
    return this.service.createType(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content type" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentTypeDto })
  update(@Param("id") id: string, @Body() dto: UpdateContentTypeDto) {
    return this.service.updateType(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content type" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteType(id);
  }
}
