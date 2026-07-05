import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserEntityType } from "@prisma/client";
import { RelationValidationService } from "../../src/common/services/relation-validation.service";
import { PrismaService } from "../../src/database/prisma/prisma.service";

function createFullPrismaMock() {
  const record = { id: "00000000-0000-4000-8000-000000000001", deletedAt: null, countryId: "c", stateId: "s", cityId: "ci", areaId: "a", contentId: "ci2", panchangId: "p" };
  const delegate = () => ({
    findFirst: jest.fn().mockResolvedValue(record),
  });

  return {
    user: delegate(),
    temple: delegate(),
    country: delegate(),
    continent: delegate(),
    deity: delegate(),
    deityType: delegate(),
    deityCategory: delegate(),
    templeCategory: delegate(),
    festivalCategory: delegate(),
    state: delegate(),
    city: delegate(),
    area: delegate(),
    festival: delegate(),
    panchang: delegate(),
    panchangCategory: delegate(),
    tithi: delegate(),
    nakshatra: delegate(),
    yoga: delegate(),
    karana: delegate(),
    planet: delegate(),
    rashi: delegate(),
    supportedLanguage: delegate(),
    supportedMediaType: delegate(),
    vrat: delegate(),
    panchangDate: delegate(),
    content: delegate(),
    contentItem: delegate(),
    contentCategory: delegate(),
    contentItemType: delegate(),
    contentEntityType: delegate(),
    contentGallery: delegate(),
    contentMedia: delegate(),
    contentTag: delegate(),
    contentType: delegate(),
  };
}

describe("RelationValidationService expanded coverage", () => {
  let service: RelationValidationService;
  let prisma: ReturnType<typeof createFullPrismaMock>;

  beforeEach(async () => {
    prisma = createFullPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelationValidationService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(RelationValidationService);
  });

  it("validates all foreign keys when records exist", async () => {
    await expect(
      service.validateForeignKeys({
        userId: "00000000-0000-4000-8000-000000000001",
        templeId: "00000000-0000-4000-8000-000000000001",
        countryId: "00000000-0000-4000-8000-000000000001",
        deityId: "00000000-0000-4000-8000-000000000001",
        festivalId: "00000000-0000-4000-8000-000000000001",
        panchangId: "00000000-0000-4000-8000-000000000001",
        vratId: "00000000-0000-4000-8000-000000000001",
        contentItemId: "00000000-0000-4000-8000-000000000001",
      }),
    ).resolves.toBeUndefined();
  });

  it("throws when foreign keys are missing", async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    await expect(service.validateForeignKeys({ userId: "missing" })).rejects.toThrow(NotFoundException);
  });

  it("validates user entity types", async () => {
    await expect(service.validateUserEntity(UserEntityType.TEMPLE, "00000000-0000-4000-8000-000000000001")).resolves.toBeUndefined();
    await expect(service.validateUserEntity(UserEntityType.FESTIVAL, "00000000-0000-4000-8000-000000000001")).resolves.toBeUndefined();
    await expect(service.validateUserEntity(UserEntityType.DEITY, "00000000-0000-4000-8000-000000000001")).resolves.toBeUndefined();
    await expect(service.validateUserEntity(UserEntityType.CONTENT, "00000000-0000-4000-8000-000000000001")).resolves.toBeUndefined();
  });

  it("validates hierarchy helpers", async () => {
    await expect(service.validateStateHierarchy("c", "s")).resolves.toBeUndefined();
    await expect(service.validateCityHierarchy("s", "ci", "c")).resolves.toBeUndefined();
    await expect(service.validateAreaHierarchy("ci", "a", "s", "c")).resolves.toBeUndefined();
    await expect(
      service.validateTempleLocationHierarchy({ countryId: "c", stateId: "s", cityId: "ci", areaId: "a" }),
    ).resolves.toBeUndefined();
    await expect(service.validatePanchangDateHierarchy("p", "d")).resolves.toBeUndefined();
    await expect(service.validateContentGalleryHierarchy("item", "gallery")).resolves.toBeUndefined();
    await expect(service.validateContentMediaHierarchy("item", "media")).resolves.toBeUndefined();
  });

  it("throws on hierarchy mismatches", async () => {
    prisma.state.findFirst.mockResolvedValue({ id: "s", countryId: "other" });
    await expect(service.validateStateHierarchy("c", "s")).rejects.toThrow(BadRequestException);

    prisma.city.findFirst.mockResolvedValue({ id: "ci", stateId: "other", countryId: "c" });
    await expect(service.validateCityHierarchy("s", "ci", "c")).rejects.toThrow(BadRequestException);

    prisma.area.findFirst.mockResolvedValue({ id: "a", cityId: "other", stateId: "s", countryId: "c" });
    await expect(service.validateAreaHierarchy("ci", "a", "s", "c")).rejects.toThrow(BadRequestException);

    prisma.panchangDate.findFirst.mockResolvedValue(null);
    await expect(service.validatePanchangDateHierarchy("p", "d")).rejects.toThrow(NotFoundException);

    prisma.contentGallery.findFirst.mockResolvedValue(null);
    await expect(service.validateContentGalleryHierarchy("item", "gallery")).rejects.toThrow(NotFoundException);
  });
});
