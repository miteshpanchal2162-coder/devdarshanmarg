import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateUserReviewDto,
  UpdateUserReviewDto,
  UpdateUserReviewStatusDto,
  UserReviewQueryDto,
} from "./dto/user-review.dto";
import { UserReviewResponseDto } from "./dto/user-review-response.dto";
import { UserReviewsService } from "./user-reviews.service";

@ApiTags("User Reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("user-reviews")
export class UserReviewsController {
  constructor(private readonly service: UserReviewsService) {}

  @Get()
  @ApiOperation({ summary: "List user reviews" })
  @ApiPaginatedResponse(UserReviewResponseDto)
  findAll(@Query() query: UserReviewQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user review by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user review" })
  @ApiBody({ type: CreateUserReviewDto })
  create(@Body() dto: CreateUserReviewDto) {
    return this.service.createReview(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user review" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserReviewDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserReviewDto) {
    return this.service.updateReview(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete user review" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteReview(id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore user review" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string) {
    return this.service.restoreReview(id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update user review status" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserReviewStatusDto })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateUserReviewStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
