import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateUserCommentDto,
  UpdateUserCommentDto,
  UpdateUserCommentStatusDto,
  UserCommentQueryDto,
} from "./dto/user-comment.dto";
import { UserCommentResponseDto } from "./dto/user-comment-response.dto";
import { UserCommentsService } from "./user-comments.service";

@ApiTags("User Comments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("user-comments")
export class UserCommentsController {
  constructor(private readonly service: UserCommentsService) {}

  @Get()
  @ApiOperation({ summary: "List user comments" })
  @ApiPaginatedResponse(UserCommentResponseDto)
  findAll(@Query() query: UserCommentQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user comment by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user comment" })
  @ApiBody({ type: CreateUserCommentDto })
  create(@Body() dto: CreateUserCommentDto) {
    return this.service.createComment(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user comment" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserCommentDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserCommentDto) {
    return this.service.updateComment(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete user comment" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteComment(id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore user comment" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string) {
    return this.service.restoreComment(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update user comment status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserCommentStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateUserCommentStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
