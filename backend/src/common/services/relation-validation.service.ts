import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";

@Injectable()
export class RelationValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateForeignKeys(input: {
    areaId?: string | null;
    cityId?: string | null;
    categoryId?: string | null;
    continentId?: string | null;
    countryId?: string | null;
    deityId?: string | null;
    festivalCategoryId?: string | null;
    festivalId?: string | null;
    languageId?: string | null;
    mediaTypeId?: string | null;
    stateId?: string | null;
    templeId?: string | null;
    userId?: string | null;
  }) {
    await Promise.all([
      input.templeId ? this.ensureTemple(input.templeId) : undefined,
      input.categoryId ? this.ensureTempleCategory(input.categoryId) : undefined,
      input.festivalCategoryId ? this.ensureFestivalCategory(input.festivalCategoryId) : undefined,
      input.continentId ? this.ensureContinent(input.continentId) : undefined,
      input.countryId ? this.ensureCountry(input.countryId) : undefined,
      input.deityId ? this.ensureDeity(input.deityId) : undefined,
      input.stateId ? this.ensureState(input.stateId) : undefined,
      input.cityId ? this.ensureCity(input.cityId) : undefined,
      input.areaId ? this.ensureArea(input.areaId) : undefined,
      input.festivalId ? this.ensureFestival(input.festivalId) : undefined,
      input.languageId ? this.ensureLanguage(input.languageId) : undefined,
      input.mediaTypeId ? this.ensureMediaType(input.mediaTypeId) : undefined,
      input.userId ? this.ensureUser(input.userId) : undefined,
    ]);
  }

  async validateStateHierarchy(countryId: string, stateId: string) {
    const state = await this.prisma.state.findFirst({
      where: { deletedAt: null, id: stateId },
    });
    if (!state) throw new NotFoundException("State not found");
    if (state.countryId !== countryId) {
      throw new BadRequestException("State must belong to country");
    }
  }

  async validateCityHierarchy(stateId: string, cityId: string, countryId?: string) {
    const city = await this.prisma.city.findFirst({
      where: { deletedAt: null, id: cityId },
    });
    if (!city) throw new NotFoundException("City not found");
    if (city.stateId !== stateId) {
      throw new BadRequestException("City must belong to state");
    }
    if (countryId && city.countryId !== countryId) {
      throw new BadRequestException("City must belong to country");
    }
  }

  async validateAreaHierarchy(cityId: string, areaId: string, stateId?: string, countryId?: string) {
    const area = await this.prisma.area.findFirst({
      where: { deletedAt: null, id: areaId },
    });
    if (!area) throw new NotFoundException("Area not found");
    if (area.cityId !== cityId) {
      throw new BadRequestException("Area must belong to city");
    }
    if (stateId && area.stateId !== stateId) {
      throw new BadRequestException("Area must belong to state");
    }
    if (countryId && area.countryId !== countryId) {
      throw new BadRequestException("Area must belong to country");
    }
  }

  async validateTempleLocationHierarchy(input: {
    areaId: string;
    cityId: string;
    countryId: string;
    stateId: string;
  }) {
    await this.validateStateHierarchy(input.countryId, input.stateId);
    await this.validateCityHierarchy(input.stateId, input.cityId, input.countryId);
    await this.validateAreaHierarchy(input.cityId, input.areaId, input.stateId, input.countryId);
  }

  private async ensureTemple(id: string) {
    if (!(await this.prisma.temple.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Temple not found");
    }
  }

  private async ensureCountry(id: string) {
    if (!(await this.prisma.country.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Country not found");
    }
  }

  private async ensureContinent(id: string) {
    if (!(await this.prisma.continent.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Continent not found");
    }
  }

  private async ensureDeity(id: string) {
    if (!(await this.prisma.deity.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Deity not found");
    }
  }

  private async ensureTempleCategory(id: string) {
    if (!(await this.prisma.templeCategory.findFirst({ where: { id } }))) {
      throw new NotFoundException("Temple category not found");
    }
  }

  private async ensureFestivalCategory(id: string) {
    if (!(await this.prisma.festivalCategory.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Festival category not found");
    }
  }

  private async ensureState(id: string) {
    if (!(await this.prisma.state.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("State not found");
    }
  }

  private async ensureCity(id: string) {
    if (!(await this.prisma.city.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("City not found");
    }
  }

  private async ensureArea(id: string) {
    if (!(await this.prisma.area.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Area not found");
    }
  }

  private async ensureFestival(id: string) {
    if (!(await this.prisma.festival.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Festival not found");
    }
  }

  private async ensureLanguage(id: string) {
    if (!(await this.prisma.supportedLanguage.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Language not found");
    }
  }

  private async ensureMediaType(id: string) {
    if (!(await this.prisma.supportedMediaType.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("Media type not found");
    }
  }

  private async ensureUser(id: string) {
    if (!(await this.prisma.user.findFirst({ where: { deletedAt: null, id } }))) {
      throw new NotFoundException("User not found");
    }
  }
}
