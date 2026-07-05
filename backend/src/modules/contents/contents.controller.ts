import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentQueryDto,
  ContentResponseDto,
  CreateContentDto,
  UpdateContentDto,
  UpdateContentStatusDto,
} from "./dto/content.dto";
import { ContentsService } from "./contents.service";

@ApiTags("Contents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("contents")
export class ContentsController {
  constructor(private readonly service: ContentsService) {}

  @Get()
  @ApiOperation({ summary: "List contents" })
  @ApiPaginatedResponse(ContentResponseDto)
  findAll(@Query() query: ContentQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get content by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create content" })
  @ApiBody({ type: CreateContentDto })
  create(@Body() dto: CreateContentDto) {
    return this.service.createContent(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update content" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentDto })
  update(@Param("id") id: string, @Body() dto: UpdateContentDto) {
    return this.service.updateContent(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Archive content" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteContent(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update content status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateContentStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateContentStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
