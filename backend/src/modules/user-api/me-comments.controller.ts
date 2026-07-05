import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { UserCommentResponseDto } from "../user-comments/dto/user-comment-response.dto";
import { MeCreateCommentDto, MeUpdateCommentDto } from "./dto/me-body.dto";
import { MeCommentQueryDto } from "./dto/me-query.dto";
import { MeCommentsService } from "./me-comments.service";

@ApiTags("Me - Comments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me/comments")
export class MeCommentsController {
  constructor(private readonly service: MeCommentsService) {}

  @Get()
  @ApiOperation({ summary: "List current user comments" })
  @ApiPaginatedResponse(UserCommentResponseDto)
  findAll(@Req() request: { user: AuthUser }, @Query() query: MeCommentQueryDto) {
    return this.service.findAll(request.user.id, query);
  }

  @Post()
  @ApiOperation({ summary: "Create a comment for current user" })
  @ApiBody({ type: MeCreateCommentDto })
  create(@Req() request: { user: AuthUser }, @Body() dto: MeCreateCommentDto) {
    return this.service.create(request.user.id, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a comment for current user" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: MeUpdateCommentDto })
  update(
    @Req() request: { user: AuthUser },
    @Param("id") id: string,
    @Body() dto: MeUpdateCommentDto,
  ) {
    return this.service.update(request.user.id, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a comment for current user" })
  @ApiParam({ name: "id", type: String })
  remove(@Req() request: { user: AuthUser }, @Param("id") id: string) {
    return this.service.remove(request.user.id, id);
  }
}
