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
import { UserRatingResponseDto } from "../user-ratings/dto/user-rating-response.dto";
import { MeCreateRatingDto, MeUpdateRatingDto } from "./dto/me-body.dto";
import { MeRatingQueryDto } from "./dto/me-query.dto";
import { MeRatingsService } from "./me-ratings.service";

@ApiTags("Me - Ratings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me/ratings")
export class MeRatingsController {
  constructor(private readonly service: MeRatingsService) {}

  @Get()
  @ApiOperation({ summary: "List current user ratings" })
  @ApiPaginatedResponse(UserRatingResponseDto)
  findAll(@Req() request: { user: AuthUser }, @Query() query: MeRatingQueryDto) {
    return this.service.findAll(request.user.id, query);
  }

  @Post()
  @ApiOperation({ summary: "Create a rating for current user" })
  @ApiBody({ type: MeCreateRatingDto })
  create(@Req() request: { user: AuthUser }, @Body() dto: MeCreateRatingDto) {
    return this.service.create(request.user.id, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a rating for current user" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: MeUpdateRatingDto })
  update(
    @Req() request: { user: AuthUser },
    @Param("id") id: string,
    @Body() dto: MeUpdateRatingDto,
  ) {
    return this.service.update(request.user.id, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a rating for current user" })
  @ApiParam({ name: "id", type: String })
  remove(@Req() request: { user: AuthUser }, @Param("id") id: string) {
    return this.service.remove(request.user.id, id);
  }
}
