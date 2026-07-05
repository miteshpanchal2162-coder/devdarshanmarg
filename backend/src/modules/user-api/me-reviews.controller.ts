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
import { UserReviewResponseDto } from "../user-reviews/dto/user-review-response.dto";
import { MeCreateReviewDto, MeUpdateReviewDto } from "./dto/me-body.dto";
import { MeReviewQueryDto } from "./dto/me-query.dto";
import { MeReviewsService } from "./me-reviews.service";

@ApiTags("Me - Reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me/reviews")
export class MeReviewsController {
  constructor(private readonly service: MeReviewsService) {}

  @Get()
  @ApiOperation({ summary: "List current user reviews" })
  @ApiPaginatedResponse(UserReviewResponseDto)
  findAll(@Req() request: { user: AuthUser }, @Query() query: MeReviewQueryDto) {
    return this.service.findAll(request.user.id, query);
  }

  @Post()
  @ApiOperation({ summary: "Create a review for current user" })
  @ApiBody({ type: MeCreateReviewDto })
  create(@Req() request: { user: AuthUser }, @Body() dto: MeCreateReviewDto) {
    return this.service.create(request.user.id, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a review for current user" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: MeUpdateReviewDto })
  update(
    @Req() request: { user: AuthUser },
    @Param("id") id: string,
    @Body() dto: MeUpdateReviewDto,
  ) {
    return this.service.update(request.user.id, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a review for current user" })
  @ApiParam({ name: "id", type: String })
  remove(@Req() request: { user: AuthUser }, @Param("id") id: string) {
    return this.service.remove(request.user.id, id);
  }
}
