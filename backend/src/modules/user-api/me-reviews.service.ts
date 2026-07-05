import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UserReviewsService } from "../user-reviews/user-reviews.service";
import { assertResourceOwnership } from "./common/ownership.util";
import { MeCreateReviewDto, MeUpdateReviewDto } from "./dto/me-body.dto";
import { MeReviewQueryDto } from "./dto/me-query.dto";

@Injectable()
export class MeReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userReviewsService: UserReviewsService,
  ) {}

  findAll(userId: string, query: MeReviewQueryDto) {
    return this.userReviewsService.findAll({ ...query, userId });
  }

  create(userId: string, dto: MeCreateReviewDto) {
    return this.userReviewsService.createReview({ ...dto, userId });
  }

  async update(userId: string, id: string, dto: MeUpdateReviewDto) {
    const review = await this.prisma.userReview.findFirst({
      where: { id, deletedAt: null },
    });
    assertResourceOwnership(review, userId, "Review");
    return this.userReviewsService.updateReview(id, { ...dto, userId });
  }

  async remove(userId: string, id: string) {
    const review = await this.prisma.userReview.findFirst({
      where: { id, deletedAt: null },
    });
    assertResourceOwnership(review, userId, "Review");
    return this.userReviewsService.deleteReview(id);
  }
}
