import { Injectable, NotFoundException } from "@nestjs/common";
import { Status } from "@prisma/client";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PanchangDatesService } from "../../panchang-dates/panchang-dates.service";
import { PublicQueryDto } from "../common/public-query.dto";
import {
  activeStatusWhere,
  publicFindBySlug,
  publicFindMany,
  sanitizePublicRecord,
} from "../common/public-response.util";
import { createApiResponse } from "../../../common/services/api-response.service";

@Injectable()
export class PublicPanchangService {
  private readonly panchangReadOptions = {
    allowedFilterFields: ["countryId", "stateId", "isDefault"],
    allowedSortFields: [
      "name",
      "slug",
      "calendarType",
      "timezone",
      "isDefault",
      "sortOrder",
      "createdAt",
    ],
    searchableFields: ["name", "slug", "description", "calendarType", "timezone"],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly panchangDatesService: PanchangDatesService,
  ) {}

  findAll(query: PublicQueryDto) {
    return publicFindMany(this.prisma.panchang, query, activeStatusWhere(), this.panchangReadOptions);
  }

  findBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.panchang,
      slug,
      activeStatusWhere(),
      "Panchang fetched successfully",
    );
  }

  async findDates(slug: string, query: PublicQueryDto) {
    const panchang = await this.resolvePanchang(slug);
    const response = await this.panchangDatesService.findByPanchang(panchang.id, {
      ...query,
      status: Status.ACTIVE,
    });

    return {
      ...response,
      data: {
        items: response.data.items.map((item) => sanitizePublicRecord(item as Record<string, unknown>)),
        meta: response.data.meta,
      },
    };
  }

  async findDateByCalendarDate(slug: string, calendarDate: string) {
    const panchang = await this.resolvePanchang(slug);
    const date = new Date(calendarDate);
    const item = await this.prisma.panchangDate.findFirst({
      where: {
        panchangId: panchang.id,
        calendarDate: date,
        status: Status.ACTIVE,
      },
    });

    if (!item) {
      throw new NotFoundException("Panchang date not found");
    }

    return createApiResponse(
      "Panchang date fetched successfully",
      sanitizePublicRecord(item as Record<string, unknown>),
    );
  }

  private async resolvePanchang(slug: string) {
    const panchang = await this.prisma.panchang.findFirst({
      where: { slug, ...activeStatusWhere() },
    });

    if (!panchang) {
      throw new NotFoundException("Panchang not found");
    }

    return panchang;
  }
}
