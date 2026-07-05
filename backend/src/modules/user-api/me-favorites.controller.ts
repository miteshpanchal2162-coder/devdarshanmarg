import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { UserFavoriteResponseDto } from "../user-favorites/dto/user-favorite-response.dto";
import { MeCreateFavoriteDto } from "./dto/me-body.dto";
import { MeFavoriteQueryDto } from "./dto/me-query.dto";
import { MeFavoritesService } from "./me-favorites.service";

@ApiTags("Me - Favorites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me/favorites")
export class MeFavoritesController {
  constructor(private readonly service: MeFavoritesService) {}

  @Get()
  @ApiOperation({ summary: "List current user favorites" })
  @ApiPaginatedResponse(UserFavoriteResponseDto)
  findAll(@Req() request: { user: AuthUser }, @Query() query: MeFavoriteQueryDto) {
    return this.service.findAll(request.user.id, query);
  }

  @Post()
  @ApiOperation({ summary: "Add a favorite for current user" })
  @ApiBody({ type: MeCreateFavoriteDto })
  create(@Req() request: { user: AuthUser }, @Body() dto: MeCreateFavoriteDto) {
    return this.service.create(request.user.id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove a favorite for current user" })
  @ApiParam({ name: "id", type: String })
  remove(@Req() request: { user: AuthUser }, @Param("id") id: string) {
    return this.service.remove(request.user.id, id);
  }
}
