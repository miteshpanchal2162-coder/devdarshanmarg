import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateUserFavoriteDto, UserFavoriteQueryDto } from "./dto/user-favorite.dto";
import { UpdateUserFavoriteDto } from "./dto/update-user-favorite.dto";
import { UserFavoriteResponseDto } from "./dto/user-favorite-response.dto";
import { UserFavoritesService } from "./user-favorites.service";

@ApiTags("User Favorites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("user-favorites")
export class UserFavoritesController {
  constructor(private readonly service: UserFavoritesService) {}

  @Get()
  @ApiOperation({ summary: "List user favorites" })
  @ApiPaginatedResponse(UserFavoriteResponseDto)
  findAll(@Query() query: UserFavoriteQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user favorite by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user favorite" })
  @ApiBody({ type: CreateUserFavoriteDto })
  create(@Body() dto: CreateUserFavoriteDto) {
    return this.service.createFavorite(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user favorite" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserFavoriteDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserFavoriteDto) {
    return this.service.updateFavorite(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user favorite" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteFavorite(id);
  }
}
