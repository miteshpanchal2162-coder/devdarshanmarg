import { Injectable } from "@nestjs/common";
import { FestivalDate } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";
import { CreateFestivalDateDto, UpdateFestivalDateDto } from "./dto/festival-date.dto";

@Injectable()
export class FestivalDatesService extends FestivalChildCrudService<FestivalDate> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalDate,
      {
        allowedFilterFields: ["year", "calendarType", "isEstimated"],
        allowedSortFields: ["year", "startDate", "endDate", "calendarType"],
        messageName: "Festival date",
        searchableFields: ["tithi", "paksha", "masa", "calendarType", "calculationMethod", "notes"],
        uniqueField: "year",
      },
      relationValidation,
    );
  }

  async createChild(festivalId: string, data: CreateFestivalDateDto, actorId: string) {
    return super.createChild(festivalId, this.mapDates(data), actorId);
  }

  async updateChild(festivalId: string, id: string, data: UpdateFestivalDateDto, actorId: string) {
    return super.updateChild(festivalId, id, this.mapDates(data), actorId);
  }

  private mapDates<T extends CreateFestivalDateDto | UpdateFestivalDateDto>(data: T) {
    return {
      ...data,
      ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
      ...(data.endDate ? { endDate: new Date(data.endDate) } : {}),
    };
  }
}
