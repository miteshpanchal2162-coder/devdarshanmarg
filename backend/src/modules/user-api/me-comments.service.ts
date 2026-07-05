import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UserCommentsService } from "../user-comments/user-comments.service";
import { assertResourceOwnership } from "./common/ownership.util";
import { MeCreateCommentDto, MeUpdateCommentDto } from "./dto/me-body.dto";
import { MeCommentQueryDto } from "./dto/me-query.dto";

@Injectable()
export class MeCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userCommentsService: UserCommentsService,
  ) {}

  findAll(userId: string, query: MeCommentQueryDto) {
    return this.userCommentsService.findAll({ ...query, userId });
  }

  create(userId: string, dto: MeCreateCommentDto) {
    return this.userCommentsService.createComment({ ...dto, userId });
  }

  async update(userId: string, id: string, dto: MeUpdateCommentDto) {
    const comment = await this.prisma.userComment.findFirst({
      where: { id, deletedAt: null },
    });
    assertResourceOwnership(comment, userId, "Comment");
    return this.userCommentsService.updateComment(id, { ...dto, userId });
  }

  async remove(userId: string, id: string) {
    const comment = await this.prisma.userComment.findFirst({
      where: { id, deletedAt: null },
    });
    assertResourceOwnership(comment, userId, "Comment");
    return this.userCommentsService.deleteComment(id);
  }
}
