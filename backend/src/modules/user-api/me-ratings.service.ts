import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UserRatingsService } from "../user-ratings/user-ratings.service";
import { assertResourceOwnership } from "./common/ownership.util";
import { MeCreateRatingDto, MeUpdateRatingDto } from "./dto/me-body.dto";
import { MeRatingQueryDto } from "./dto/me-query.dto";

@Injectable()
export class MeRatingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRatingsService: UserRatingsService,
  ) {}

  findAll(userId: string, query: MeRatingQueryDto) {
    return this.userRatingsService.findAll({ ...query, userId });
  }

  create(userId: string, dto: MeCreateRatingDto) {
    return this.userRatingsService.createRating({ ...dto, userId });
  }

  async update(userId: string, id: string, dto: MeUpdateRatingDto) {
    const rating = await this.prisma.userRating.findUnique({ where: { id } });
    assertResourceOwnership(rating, userId, "Rating");
    return this.userRatingsService.updateRating(id, { ...dto, userId });
  }

  async remove(userId: string, id: string) {
    const rating = await this.prisma.userRating.findUnique({ where: { id } });
    assertResourceOwnership(rating, userId, "Rating");
    return this.userRatingsService.deleteRating(id);
  }
}
