import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatistics } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import { CreateContentStatisticsDto, UpdateContentStatisticsDto } from "./dto/content-statistics.dto";

@Injectable()
export class ContentStatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByContentItem(contentItemId: string) {
    await this.relationValidation.validateForeignKeys({ contentItemId });
    const item = await this.prisma.contentStatistics.findUnique({
      where: { contentId: contentItemId },
    });

    if (!item) {
      throw new NotFoundException("Content statistics not found");
    }

    return createApiResponse("Content statistics fetched successfully", this.toResponse(item));
  }

  async createStatistics(contentItemId: string, dto: CreateContentStatisticsDto) {
    await this.relationValidation.validateForeignKeys({ contentItemId });
    const existing = await this.prisma.contentStatistics.findUnique({
      where: { contentId: contentItemId },
    });

    if (existing) {
      throw new ConflictException("Content statistics already exists for this content item");
    }

    const item = await this.prisma.contentStatistics.create({
      data: {
        ...dto,
        contentId: contentItemId,
      },
    });

    return createApiResponse("Content statistics created successfully", this.toResponse(item));
  }

  async updateStatistics(contentItemId: string, dto: UpdateContentStatisticsDto) {
    const existing = await this.ensureRecord(contentItemId);
    const item = await this.prisma.contentStatistics.update({
      where: { id: existing.id },
      data: dto,
    });

    return createApiResponse("Content statistics updated successfully", this.toResponse(item));
  }

  async deleteStatistics(contentItemId: string) {
    const existing = await this.ensureRecord(contentItemId);
    const item = await this.prisma.contentStatistics.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Content statistics deleted successfully", this.toResponse(item));
  }

  private async ensureRecord(contentItemId: string) {
    await this.relationValidation.validateForeignKeys({ contentItemId });
    const item = await this.prisma.contentStatistics.findUnique({
      where: { contentId: contentItemId },
    });

    if (!item) {
      throw new NotFoundException("Content statistics not found");
    }

    return item;
  }

  private toResponse(item: ContentStatistics) {
    return serializeValue(item) as ContentStatistics;
  }
}
