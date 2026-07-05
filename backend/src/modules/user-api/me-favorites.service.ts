import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UserFavoritesService } from "../user-favorites/user-favorites.service";
import { assertResourceOwnership } from "./common/ownership.util";
import { MeCreateFavoriteDto } from "./dto/me-body.dto";
import { MeFavoriteQueryDto } from "./dto/me-query.dto";

@Injectable()
export class MeFavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userFavoritesService: UserFavoritesService,
  ) {}

  findAll(userId: string, query: MeFavoriteQueryDto) {
    return this.userFavoritesService.findAll({ ...query, userId });
  }

  create(userId: string, dto: MeCreateFavoriteDto) {
    return this.userFavoritesService.createFavorite({ ...dto, userId });
  }

  async remove(userId: string, id: string) {
    const favorite = await this.prisma.userFavorite.findUnique({ where: { id } });
    assertResourceOwnership(favorite, userId, "Favorite");
    return this.userFavoritesService.deleteFavorite(id);
  }
}
