import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentTagQueryDto,
  ContentTagResponseDto,
  CreateContentTagDto,
  UpdateContentTagDto,
} from "./dto/content-tag.dto";
import { ContentTagsService } from "./content-tags.service";

@ApiTags("Content Tags")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-tags")
export class ContentTagsController {
  constructor(private readonly service: ContentTagsService) {}

  @Get()
  @ApiOperation({ summary: "List content tags" })
  @ApiPaginatedResponse(ContentTagResponseDto)
  findAll(@Query() query: ContentTagQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content tag by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content tag" })
  @ApiBody({ type: CreateContentTagDto })
  create(@Body() dto: CreateContentTagDto) {
    return this.service.createTag(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content tag" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentTagDto })
  update(@Param("id") id: string, @Body() dto: UpdateContentTagDto) {
    return this.service.updateTag(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete content tag" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteTag(id);
  }
}
