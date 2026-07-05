import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ContentSeo } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import { CreateContentSeoDto, UpdateContentSeoDto } from "./dto/content-seo.dto";

@Injectable()
export class ContentSeoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByContentItem(contentItemId: string) {
    await this.relationValidation.validateForeignKeys({ contentItemId });
    const item = await this.prisma.contentSeo.findUnique({
      where: { contentId: contentItemId },
    });

    if (!item) {
      throw new NotFoundException("Content SEO not found");
    }

    return createApiResponse("Content SEO fetched successfully", this.toResponse(item));
  }

  async createSeo(contentItemId: string, dto: CreateContentSeoDto) {
    await this.relationValidation.validateForeignKeys({ contentItemId });
    const existing = await this.prisma.contentSeo.findUnique({
      where: { contentId: contentItemId },
    });

    if (existing) {
      throw new ConflictException("Content SEO already exists for this content item");
    }

    const item = await this.prisma.contentSeo.create({
      data: {
        ...this.preparePayload(dto),
        contentId: contentItemId,
      },
    });

    return createApiResponse("Content SEO created successfully", this.toResponse(item));
  }

  async updateSeo(contentItemId: string, dto: UpdateContentSeoDto) {
    const existing = await this.ensureRecord(contentItemId);
    const item = await this.prisma.contentSeo.update({
      where: { id: existing.id },
      data: this.preparePayload(dto),
    });

    return createApiResponse("Content SEO updated successfully", this.toResponse(item));
  }

  async deleteSeo(contentItemId: string) {
    const existing = await this.ensureRecord(contentItemId);
    const item = await this.prisma.contentSeo.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Content SEO deleted successfully", this.toResponse(item));
  }

  private async ensureRecord(contentItemId: string) {
    await this.relationValidation.validateForeignKeys({ contentItemId });
    const item = await this.prisma.contentSeo.findUnique({
      where: { contentId: contentItemId },
    });

    if (!item) {
      throw new NotFoundException("Content SEO not found");
    }

    return item;
  }

  private preparePayload(dto: CreateContentSeoDto | UpdateContentSeoDto) {
    const payload = { ...dto } as Record<string, unknown>;

    if (typeof payload.lastIndexedAt === "string") {
      payload.lastIndexedAt = new Date(payload.lastIndexedAt);
    }

    return payload;
  }

  private toResponse(item: ContentSeo) {
    return serializeValue(item) as ContentSeo;
  }
}
