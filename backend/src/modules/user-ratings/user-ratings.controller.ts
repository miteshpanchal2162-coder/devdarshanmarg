import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateUserRatingDto, UserRatingQueryDto } from "./dto/user-rating.dto";
import { UpdateUserRatingDto } from "./dto/update-user-rating.dto";
import { UserRatingResponseDto } from "./dto/user-rating-response.dto";
import { UserRatingsService } from "./user-ratings.service";

@ApiTags("User Ratings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("user-ratings")
export class UserRatingsController {
  constructor(private readonly service: UserRatingsService) {}

  @Get()
  @ApiOperation({ summary: "List user ratings" })
  @ApiPaginatedResponse(UserRatingResponseDto)
  findAll(@Query() query: UserRatingQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user rating by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user rating" })
  @ApiBody({ type: CreateUserRatingDto })
  create(@Body() dto: CreateUserRatingDto) {
    return this.service.createRating(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user rating" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserRatingDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserRatingDto) {
    return this.service.updateRating(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user rating" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteRating(id);
  }
}
