// @ts-nocheck
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, Status, UserEntityType } from "@prisma/client";
import { firstValueFrom, of } from "rxjs";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { BaseQueryDto } from "../../src/common/dto/base-query.dto";
import { handlePrismaError } from "../../src/common/exceptions/prisma-error.handler";
import { BaseCrudService } from "../../src/common/services/base-crud.service";
import { RelationValidationService } from "../../src/common/services/relation-validation.service";
import {
  resolveMediaType,
  validateAnySupportedFile,
  validateDocumentFile,
  validateImageFile,
  validateUploadedFile,
} from "../../src/common/storage/file-validation.util";
import {
  buildActivityDetails,
  extractEntityId,
  extractUserId,
  isMutationMethod,
  resolveActivityAction,
  resolveEntityType,
  shouldSkipActivityLogPath,
} from "../../src/common/utils/activity-log.util";
import { PrismaService } from "../../src/database/prisma/prisma.service";
import { ActivityLoggingInterceptor } from "../../src/modules/activity-logs/activity-logging.interceptor";
import { ActivityLogsService } from "../../src/modules/activity-logs/activity-logs.service";
import { AbhijitMuhuratService } from "../../src/modules/abhijit-muhurat/abhijit-muhurat.service";
import { ContentGalleryItemsService } from "../../src/modules/content-gallery-items/content-gallery-items.service";
import { ContentTranslationsService } from "../../src/modules/content-translations/content-translations.service";
import { MediaLibraryService } from "../../src/modules/media-library/media-library.service";
import { PublicPanchangService } from "../../src/modules/public/panchang/public-panchang.service";
import { DeityExternalLinksService } from "../../src/modules/deity-external-links/deity-external-links.service";
import { FestivalDatesService } from "../../src/modules/festival-dates/festival-dates.service";
import { FestivalTempleMapsService } from "../../src/modules/festival-temple-maps/festival-temple-maps.service";
import { FestivalAartisService } from "../../src/modules/festival-aartis/festival-aartis.service";
import { TempleChildCrudService } from "../../src/modules/temple-child-common/temple-child-crud.service";
import { PanchangRegionsService } from "../../src/modules/panchang-regions/panchang-regions.service";
import { VratFoodRulesService } from "../../src/modules/vrat-food-rules/vrat-food-rules.service";
import { ContentVersionsService } from "../../src/modules/content-versions/content-versions.service";
import { ChoghadiyasService } from "../../src/modules/choghadiyas/choghadiyas.service";
import { GulikaKaalService } from "../../src/modules/gulika-kaal/gulika-kaal.service";
import { RahuKaalService } from "../../src/modules/rahu-kaal/rahu-kaal.service";
import { YamagandaKaalService } from "../../src/modules/yamaganda-kaal/yamaganda-kaal.service";
import { RahuKaalService } from "../../src/modules/rahu-kaal/rahu-kaal.service";
import { YamagandaKaalService } from "../../src/modules/yamaganda-kaal/yamaganda-kaal.service";
import { MeProfileService } from "../../src/modules/user-api/me-profile.service";
import { MeFavoritesService } from "../../src/modules/user-api/me-favorites.service";
import { UserProfilesService } from "../../src/modules/user-profiles/user-profiles.service";
import { UserFavoritesService } from "../../src/modules/user-favorites/user-favorites.service";
import { StorageService } from "../../src/common/storage/storage.service";
import { TempleAartisService } from "../../src/modules/temple-aartis/temple-aartis.service";
import { TempleContactsService } from "../../src/modules/temple-contacts/temple-contacts.service";
import { TemplePilgrimTipsService } from "../../src/modules/temple-pilgrim-tips/temple-pilgrim-tips.service";
import { UserNotificationPreferencesService } from "../../src/modules/user-notification-preferences/user-notification-preferences.service";
import { assertResourceOwnership } from "../../src/modules/user-api/common/ownership.util";
import { PanchangDatesService } from "../../src/modules/panchang-dates/panchang-dates.service";
import {
  ACTOR_ID,
  TEST_ID,
  baseQuery,
  createMockDelegate,
  createMockPrisma,
  createMockRelationValidation,
} from "../helpers/test-mocks";

const UUID = "00000000-0000-4000-8000-000000000001";
const UUID2 = "00000000-0000-4000-8000-000000000002";

function mockChildDelegateFindFirst(
  delegate: ReturnType<typeof createMockDelegate>,
  parentField: string,
) {
  delegate.findFirst.mockImplementation(async (args: { where?: Record<string, unknown> }) => {
    const where = args?.where ?? {};
    if (where.NOT) {
      return null;
    }
    if (where.id) {
      return { id: UUID, [parentField]: UUID, deletedAt: null, status: "ACTIVE" };
    }
    return null;
  });
}

type SoftRecord = { id: string; deletedAt: Date | null; status?: Status };

class ExtendedCrudService extends BaseCrudService<SoftRecord> {
  constructor(
    delegate: {
      create: jest.Mock;
      update: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      delete?: jest.Mock;
    },
  ) {
    super(delegate, ["name"], ["name", "createdAt"], ["status", "name"]);
  }

  exposeFindMany(query: BaseQueryDto) {
    return this.findMany(query);
  }

  exposeRestore(id: string) {
    return this.restore(id);
  }
}

describe("Deep branch coverage", () => {
  describe("activity-log.util branches", () => {
    it("covers path skipping and mutation detection", () => {
      expect(shouldSkipActivityLogPath("/docs/swagger")).toBe(true);
      expect(shouldSkipActivityLogPath("/uploads/file.png")).toBe(true);
      expect(shouldSkipActivityLogPath("/activity-logs?page=1")).toBe(true);
      expect(shouldSkipActivityLogPath("/temples")).toBe(false);
      expect(isMutationMethod("delete")).toBe(true);
    });

    it("covers resolveActivityAction branches", () => {
      expect(resolveActivityAction("POST", "/auth/logout", {})).toBe("LOGOUT");
      expect(resolveActivityAction("POST", "/auth/refresh", {})).toBe("REFRESH TOKEN");
      expect(resolveActivityAction("PATCH", "/otp-verifications/abc/verify", {})).toBe("OTP VERIFIED");
      expect(resolveActivityAction("PATCH", "/users/1/status", { status: "ACTIVE" })).toBe("UPDATE");
      expect(resolveActivityAction("DELETE", "/users/1", {})).toBe("DELETE");
      expect(resolveActivityAction("POST", "/temples", {})).toBe("CREATE");
      expect(resolveActivityAction("GET", "/temples", {})).toBeNull();
    });

    it("covers resolveEntityType branches", () => {
      expect(resolveEntityType("/")).toBe("System");
      expect(resolveEntityType("/auth/login")).toBe("Auth");
      expect(resolveEntityType("/me/favorites")).toBe("Favorite");
      expect(resolveEntityType("/temple-categories")).toBe("TempleCategory");
      expect(resolveEntityType("/countries")).toBe("Country");
    });

    it("covers extractEntityId and extractUserId branches", () => {
      expect(extractEntityId({ data: { sessionId: UUID } }, {})).toBe(UUID);
      expect(extractEntityId({ user: { id: UUID } }, {})).toBe(UUID);
      expect(extractUserId(undefined, { data: { user: { id: UUID } } }, "REFRESH TOKEN")).toBe(UUID);
      expect(extractUserId(undefined, { data: { user: { id: UUID } } }, "UPDATE")).toBeUndefined();
      expect(buildActivityDetails({ method: "POST", path: "/x" }).userAgent).toBeUndefined();
    });
  });

  describe("AllExceptionsFilter branches", () => {
    const runFilter = (exception: unknown) => {
      const filter = new AllExceptionsFilter();
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      filter.catch(exception, {
        switchToHttp: () => ({
          getResponse: () => ({ status }),
          getRequest: () => ({ url: "/test" }),
        }),
      } as never);
      return { status, json };
    };

    it("maps HttpException response objects", () => {
      const { status } = runFilter(
        new BadRequestException({ message: ["invalid"], error: "Bad Request" }),
      );
      expect(status).toHaveBeenCalledWith(400);
    });

    it("maps plain Error instances", () => {
      const { status } = runFilter(new Error("boom"));
      expect(status).toHaveBeenCalledWith(500);
    });

    it("maps unknown exceptions", () => {
      const { status } = runFilter("unexpected");
      expect(status).toHaveBeenCalledWith(500);
    });

    it("maps HttpException without structured body", () => {
      const { status } = runFilter(new UnauthorizedException("denied"));
      expect(status).toHaveBeenCalledWith(401);
    });
  });

  describe("BaseCrudService branches", () => {
    it("covers soft delete, restore, filters, and prisma errors", async () => {
      const delegate = {
        create: jest.fn().mockResolvedValue({ id: "1", deletedAt: null }),
        update: jest.fn().mockResolvedValue({ id: "1", deletedAt: null, status: Status.ACTIVE }),
        findFirst: jest
          .fn()
          .mockResolvedValueOnce({ id: "1", deletedAt: new Date(), status: Status.ACTIVE })
          .mockResolvedValueOnce({ id: "1", deletedAt: new Date(), status: Status.ARCHIVED })
          .mockResolvedValue({ id: "1", deletedAt: null, status: Status.ACTIVE }),
        findMany: jest.fn().mockResolvedValue([{ id: "1", deletedAt: null }]),
        count: jest.fn().mockResolvedValue(1),
      };
      const service = new ExtendedCrudService(delegate);

      await expect(service.exposeFindMany({ page: 1, limit: 10, search: "x", status: "ACTIVE", filters: { status: "ACTIVE", unknown: "x" }, sortBy: "name" })).resolves.toBeDefined();
      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
      await service.exposeRestore("1");

      delegate.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError("dup", { code: "P2002", clientVersion: "1" }),
      );
      await expect(service.create({ name: "x" })).rejects.toThrow(ConflictException);
    });

    it("covers delegates without soft-delete support", async () => {
      const delegate = {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest
          .fn()
          .mockRejectedValueOnce(new Error("no deletedAt"))
          .mockResolvedValue({ id: "1", status: Status.ACTIVE }),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn().mockResolvedValue({ id: "1" }),
      };
      const HardService = class extends BaseCrudService<{ id: string; status: Status }> {
        constructor() {
          super(delegate, ["name"], [], []);
        }
      };
      const service = new HardService();
      await service.findMany({ page: 1, limit: 10 });
      await service.delete("1");
    });
  });

  describe("RelationValidationService FK branches", () => {
    const FK_CASES = [
      ["templeId", "temple"],
      ["categoryId", "templeCategory"],
      ["festivalCategoryId", "festivalCategory"],
      ["contentId", "content"],
      ["contentCategoryId", "contentCategory"],
      ["contentEntityTypeId", "contentEntityType"],
      ["contentGalleryId", "contentGallery"],
      ["contentItemId", "contentItem"],
      ["contentItemTypeId", "contentItemType"],
      ["contentMediaId", "contentMedia"],
      ["contentTagId", "contentTag"],
      ["contentTypeId", "contentType"],
      ["continentId", "continent"],
      ["countryId", "country"],
      ["deityId", "deity"],
      ["relatedDeityId", "deity"],
      ["relatedContentItemId", "contentItem"],
      ["deityTypeId", "deityType"],
      ["deityCategoryId", "deityCategory"],
      ["stateId", "state"],
      ["cityId", "city"],
      ["areaId", "area"],
      ["festivalId", "festival"],
      ["karanaId", "karana"],
      ["nakshatraId", "nakshatra"],
      ["panchangId", "panchang"],
      ["panchangCategoryId", "panchangCategory"],
      ["planetId", "planet"],
      ["rashiId", "rashi"],
      ["tithiId", "tithi"],
      ["yogaId", "yoga"],
      ["languageId", "supportedLanguage"],
      ["mediaTypeId", "supportedMediaType"],
      ["userId", "user"],
      ["vratId", "vrat"],
      ["panchangDateId", "panchangDate"],
    ] as const;

    let service: RelationValidationService;
    let prisma: ReturnType<typeof createMockPrisma>;

    beforeEach(async () => {
      prisma = createMockPrisma();
      const moduleRef = await Test.createTestingModule({
        providers: [RelationValidationService, { provide: PrismaService, useValue: prisma }],
      }).compile();
      service = moduleRef.get(RelationValidationService);
    });

    it.each(FK_CASES)("throws when %s is missing", async (field, delegate) => {
      (prisma[delegate] as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue(null);
      await expect(service.validateForeignKeys({ [field]: UUID })).rejects.toThrow(NotFoundException);
    });

    it("throws for unsupported user entity type", async () => {
      await expect(service.validateUserEntity("UNKNOWN" as UserEntityType, UUID)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("covers optional hierarchy country checks", async () => {
      (prisma.city as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue({
        id: UUID,
        stateId: UUID2,
        countryId: "other",
      });
      await expect(service.validateCityHierarchy(UUID2, UUID, UUID)).rejects.toThrow(BadRequestException);

      (prisma.area as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue({
        id: UUID,
        cityId: UUID2,
        stateId: "other",
        countryId: UUID,
      });
      await expect(service.validateAreaHierarchy(UUID2, UUID, UUID2, UUID)).rejects.toThrow(BadRequestException);

      (prisma.area as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue({
        id: UUID,
        cityId: UUID2,
        stateId: UUID2,
        countryId: "other",
      });
      await expect(service.validateAreaHierarchy(UUID2, UUID, UUID2, UUID)).rejects.toThrow(BadRequestException);
    });
  });

  describe("TempleChildCrudService branches", () => {
    let aartis: TempleAartisService;
    let contacts: TempleContactsService;
    let tips: TemplePilgrimTipsService;
    let prisma: ReturnType<typeof createMockPrisma>;
    let relationValidation: ReturnType<typeof createMockRelationValidation>;

    beforeEach(async () => {
      prisma = createMockPrisma();
      relationValidation = createMockRelationValidation();
      const moduleRef = await Test.createTestingModule({
        providers: [
          TempleAartisService,
          TempleContactsService,
          TemplePilgrimTipsService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: relationValidation },
        ],
      }).compile();
      aartis = moduleRef.get(TempleAartisService);
      contacts = moduleRef.get(TempleContactsService);
      tips = moduleRef.get(TemplePilgrimTipsService);
    });

    it("executes temple child CRUD paths", async () => {
      await aartis.findByTemple(UUID, { ...baseQuery, search: "aarti", status: "ACTIVE", filters: { status: "ACTIVE" }, sortBy: "name" });
      await aartis.findChildById(UUID, UUID);
      await aartis.createChild(UUID, { name: "Morning Aarti" }, ACTOR_ID);
      await aartis.updateChild(UUID, UUID, { name: "Updated" }, ACTOR_ID);
      await aartis.updateChildStatus(UUID, UUID, Status.ARCHIVED, ACTOR_ID);
      await aartis.deleteChild(UUID, UUID, ACTOR_ID);
      await aartis.restoreChild(UUID, UUID, ACTOR_ID);
    });

    it("covers duplicate and not-found branches", async () => {
      (prisma.templeContact as ReturnType<typeof createMockDelegate>).findFirst
        .mockResolvedValueOnce({ id: UUID, templeId: UUID, contactCode: "C1" })
        .mockResolvedValue(null);
      await expect(
        contacts.createChild(UUID, { contactCode: "C1", name: "Office" }, ACTOR_ID),
      ).rejects.toThrow(ConflictException);

      (prisma.templeAarti as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue(null);
      await expect(aartis.findChildById(UUID, UUID)).rejects.toThrow(NotFoundException);
      await expect(aartis.restoreChild(UUID, UUID, ACTOR_ID)).rejects.toThrow(NotFoundException);
      await expect(aartis.updateChildStatus(UUID, UUID, Status.ACTIVE, ACTOR_ID)).rejects.toThrow(NotFoundException);
    });

    it("covers hard-delete child services", async () => {
      await tips.findByTemple(UUID, baseQuery);
      await tips.createChild(UUID, { tip: "Wear modest clothes" }, ACTOR_ID);
      await tips.deleteChild(UUID, UUID, ACTOR_ID);
    });
  });

  describe("Content child CRUD branches", () => {
    let translations: ContentTranslationsService;
    let galleryItems: ContentGalleryItemsService;
    let prisma: ReturnType<typeof createMockPrisma>;

    beforeEach(async () => {
      prisma = createMockPrisma();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ContentTranslationsService,
          ContentGalleryItemsService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      translations = moduleRef.get(ContentTranslationsService);
      galleryItems = moduleRef.get(ContentGalleryItemsService);
    });

    it("executes content child CRUD paths", async () => {
      const delegate = prisma.contentTranslation as ReturnType<typeof createMockDelegate>;
      await translations.findByContent(UUID, { ...baseQuery, search: "hello", filters: { language: "en" }, sortBy: "title" });
      delegate.findFirst.mockResolvedValueOnce(null);
      await translations.createChild(UUID, { language: "en", title: "Title" }, ACTOR_ID);
      delegate.findFirst.mockResolvedValue({ id: UUID, contentId: UUID, language: "en" });
      await translations.updateChild(UUID, UUID, { title: "Updated" }, ACTOR_ID);
      await translations.deleteChild(UUID, UUID, ACTOR_ID);
    });

    it("executes gallery child CRUD paths", async () => {
      const delegate = prisma.contentGalleryItem as ReturnType<typeof createMockDelegate>;
      mockChildDelegateFindFirst(delegate, "galleryId");
      await galleryItems.findByGallery(UUID, UUID2, { ...baseQuery, filters: { mediaId: UUID }, sortBy: "sortOrder" });
      await galleryItems.createChild(UUID, UUID2, { mediaId: UUID }, ACTOR_ID);
      await galleryItems.updateChild(UUID, UUID2, UUID, { mediaId: UUID }, ACTOR_ID);
      await galleryItems.deleteChild(UUID, UUID2, UUID, ACTOR_ID);
    });

    it("covers duplicate and not-found gallery branches", async () => {
      (prisma.contentGalleryItem as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue(null);
      await expect(galleryItems.findChildById(UUID, UUID2, UUID)).rejects.toThrow(NotFoundException);
      await expect(
        galleryItems.updateChild(UUID, UUID2, UUID, { mediaId: UUID }, ACTOR_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("Panchang child and public service branches", () => {
    it("covers abhijit muhurat CRUD branches", async () => {
      const prisma = createMockPrisma();
      const abhijit = prisma.abhijitMuhurat as ReturnType<typeof createMockDelegate>;
      const moduleRef = await Test.createTestingModule({
        providers: [
          AbhijitMuhuratService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const service = moduleRef.get(AbhijitMuhuratService);

      abhijit.findUnique.mockResolvedValueOnce({ id: UUID, panchangDateId: UUID2 });
      await service.findByPanchangDate(UUID, UUID2);
      abhijit.findUnique.mockResolvedValueOnce(null);
      await service.createAbhijitMuhurat(UUID, UUID2, {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        isAvailable: true,
      });
      abhijit.findUnique.mockResolvedValue({ id: UUID, panchangDateId: UUID2 });
      await service.updateAbhijitMuhurat(UUID, UUID2, { isAvailable: false });
      await service.deleteAbhijitMuhurat(UUID, UUID2);

      abhijit.findUnique.mockResolvedValue(null);
      await expect(service.findByPanchangDate(UUID, UUID2)).rejects.toThrow(NotFoundException);

      abhijit.findUnique.mockResolvedValue({ id: UUID });
      await expect(
        service.createAbhijitMuhurat(UUID, UUID2, {
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("covers public panchang branches", async () => {
      const prisma = createMockPrisma();
      const panchangDatesService = {
        findByPanchang: jest.fn().mockResolvedValue({
          data: { items: [{ id: UUID, createdBy: "admin" }], meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false } },
        }),
      };
      const moduleRef = await Test.createTestingModule({
        providers: [
          PublicPanchangService,
          { provide: PrismaService, useValue: prisma },
          { provide: PanchangDatesService, useValue: panchangDatesService },
        ],
      }).compile();
      const service = moduleRef.get(PublicPanchangService);

      await service.findAll({ page: 1, limit: 10, search: "daily" });
      await service.findBySlug("daily-panchang");
      await service.findDates("daily-panchang", { page: 1, limit: 10 });
      await service.findDateByCalendarDate("daily-panchang", "2026-07-04");

      (prisma.panchang as ReturnType<typeof createMockDelegate>).findFirst.mockResolvedValue(null);
      await expect(service.findDateByCalendarDate("missing", "2026-07-04")).rejects.toThrow(NotFoundException);
    });
  });

  describe("User-facing service branches", () => {
    it("covers notification preference CRUD branches", async () => {
      const prisma = createMockPrisma();
      const prefs = prisma.userNotificationPreference as ReturnType<typeof createMockDelegate>;
      const moduleRef = await Test.createTestingModule({
        providers: [
          UserNotificationPreferencesService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const service = moduleRef.get(UserNotificationPreferencesService);

      prefs.findUnique.mockResolvedValueOnce({ id: UUID, userId: UUID });
      await service.findByUserId(UUID);
      prefs.findUnique.mockResolvedValueOnce(null);
      await service.createPreference(UUID, { emailEnabled: true });
      prefs.findUnique.mockResolvedValue({ id: UUID, userId: UUID });
      await service.updatePreference(UUID, { pushEnabled: false });
      await service.deletePreference(UUID);

      prefs.findUnique.mockResolvedValue(null);
      await expect(service.findByUserId(UUID)).rejects.toThrow(NotFoundException);
    });

    it("throws when notification preference already exists", async () => {
      const prisma = createMockPrisma();
      const prefs = prisma.userNotificationPreference as ReturnType<typeof createMockDelegate>;
      const moduleRef = await Test.createTestingModule({
        providers: [
          UserNotificationPreferencesService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const service = moduleRef.get(UserNotificationPreferencesService);
      prefs.findUnique.mockResolvedValue({ id: UUID, userId: UUID });
      await expect(service.createPreference(UUID, {})).rejects.toThrow(ConflictException);
    });

    it("covers ownership util branches", () => {
      expect(() => assertResourceOwnership(null, UUID)).toThrow(NotFoundException);
      expect(() => assertResourceOwnership({ userId: UUID2 }, UUID)).toThrow(ForbiddenException);
      expect(assertResourceOwnership({ userId: UUID }, UUID)).toBeUndefined();
    });
  });

  describe("Media library and upload branches", () => {
    it("covers media library CRUD and upload paths", async () => {
      const prisma = createMockPrisma();
      const storageService = {
        buildRelativePath: jest.fn().mockReturnValue("images/test.png"),
        deletePhysicalFile: jest.fn(),
        deleteUploadedFileIfExists: jest.fn(),
      };
      const moduleRef = await Test.createTestingModule({
        providers: [
          MediaLibraryService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
          { provide: StorageService, useValue: storageService },
        ],
      }).compile();
      const service = moduleRef.get(MediaLibraryService);

      await service.findAll({ page: 1, limit: 10, search: "image" });
      await service.findById(UUID);
      await service.createItem(
        {
          filename: "a.png",
          originalName: "a.png",
          mimeType: "image/png",
          mediaType: "image",
          storagePath: "temples/a.png",
          fileSize: 1000,
        },
        ACTOR_ID,
      );
      await service.updateItem(UUID, { altText: "Alt" });
      await service.deleteItem(UUID);
      await service.uploadFile(
        { mimetype: "image/png", originalname: "a.png", filename: "a.png", size: 1000 } as Express.Multer.File,
        "temples",
        ACTOR_ID,
        "image",
        "Alt",
      );

      await expect(service.uploadFile(undefined, "temples", ACTOR_ID, "image")).rejects.toThrow(BadRequestException);
    });

    it("covers upload validation modes", () => {
      const imageFile = { mimetype: "image/png", originalname: "a.png", size: 1000 };
      validateUploadedFile(imageFile, "image");
      validateUploadedFile(
        { mimetype: "application/pdf", originalname: "a.pdf", size: 1000 },
        "document",
      );
      validateUploadedFile(
        { mimetype: "image/png", originalname: "a.png", size: 1000 },
        "any",
      );
      expect(resolveMediaType("image/png", "png")).toBe("image");
      expect(resolveMediaType("application/pdf", "pdf")).toBe("document");
      expect(() => validateImageFile("image/png", "png")).not.toThrow();
      expect(() => validateDocumentFile("application/pdf", "pdf")).not.toThrow();
      expect(() => validateAnySupportedFile("image/png", "png")).not.toThrow();
    });
  });

  describe("ActivityLoggingInterceptor branches", () => {
    it("records activity for successful mutations", async () => {
      const activityLogsService = { recordActivity: jest.fn().mockResolvedValue(undefined) };
      const interceptor = new ActivityLoggingInterceptor(activityLogsService as unknown as ActivityLogsService);

      const nonHttpContext = {
        getType: () => "rpc",
        switchToHttp: () => ({ getRequest: () => ({}) }),
      } as unknown as ExecutionContext;
      await firstValueFrom(interceptor.intercept(nonHttpContext, { handle: () => of({ success: true }) }));

      const skippedContext = {
        getType: () => "http",
        switchToHttp: () => ({
          getRequest: () => ({ method: "POST", url: "/public/temples", headers: {} }),
        }),
      } as unknown as ExecutionContext;
      await firstValueFrom(interceptor.intercept(skippedContext, { handle: () => of({ success: true }) }));

      const mutationContext = {
        getType: () => "http",
        switchToHttp: () => ({
          getRequest: () => ({
            method: "POST",
            originalUrl: "/auth/login",
            headers: { "user-agent": "jest" },
            body: {},
            user: { id: UUID },
            ip: "127.0.0.1",
          }),
        }),
      } as unknown as ExecutionContext;
      await firstValueFrom(
        interceptor.intercept(mutationContext, {
          handle: () => of({ success: true, data: { user: { id: UUID } } }),
        }),
      );
      expect(activityLogsService.recordActivity).toHaveBeenCalled();

      activityLogsService.recordActivity.mockRejectedValueOnce(new Error("log failed"));
      await firstValueFrom(
        interceptor.intercept(mutationContext, {
          handle: () => of({ success: false }),
        }),
      );

      const routeContext = {
        getType: () => "http",
        switchToHttp: () => ({
          getRequest: () => ({
            method: "POST",
            route: { path: "/users" },
            headers: {},
            body: { name: "Test" },
            user: { id: UUID },
          }),
        }),
      } as unknown as ExecutionContext;
      await firstValueFrom(
        interceptor.intercept(routeContext, {
          handle: () => of({ success: true, data: { id: UUID } }),
        }),
      );
    });
  });

  describe("Remaining child CRUD and user API branches", () => {
    async function runChildCrudSuite(
      ServiceClass: new (...args: never[]) => unknown,
      delegateKey: string,
      parentField: string,
      findBy: (service: Record<string, unknown>, parentId: string) => Promise<unknown>,
      create: (service: Record<string, unknown>, parentId: string) => Promise<unknown>,
    ) {
      const prisma = createMockPrisma();
      const delegate = prisma[delegateKey] as ReturnType<typeof createMockDelegate>;
      mockChildDelegateFindFirst(delegate, parentField);
      const moduleRef = await Test.createTestingModule({
        providers: [
          ServiceClass,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const service = moduleRef.get(ServiceClass) as Record<string, unknown>;

      await findBy(service, UUID);
      await create(service, UUID);
      await (service.updateChild as (...args: unknown[]) => Promise<unknown>)(UUID, UUID, { name: "Updated" }, ACTOR_ID);
      await (service.deleteChild as (...args: unknown[]) => Promise<unknown>)(UUID, UUID, ACTOR_ID);
    }

    it("covers deity, festival, panchang, vrat, and content-item child CRUD", async () => {
      await runChildCrudSuite(
        DeityExternalLinksService,
        "deityExternalLink",
        "deityId",
        (service, parentId) => service.findByDeity(parentId, baseQuery),
        (service, parentId) => service.createChild(parentId, { title: "Wiki", url: "https://x" }, ACTOR_ID),
      );
      await runChildCrudSuite(
        FestivalDatesService,
        "festivalDate",
        "festivalId",
        (service, parentId) => service.findByFestival(parentId, baseQuery),
        (service, parentId) =>
          service.createChild(parentId, { calendarDate: new Date().toISOString() }, ACTOR_ID),
      );
      await runChildCrudSuite(
        PanchangRegionsService,
        "panchangRegion",
        "panchangId",
        (service, parentId) => service.findByPanchang(parentId, baseQuery),
        (service, parentId) => service.createChild(parentId, { name: "North" }, ACTOR_ID),
      );
      await runChildCrudSuite(
        VratFoodRulesService,
        "vratFoodRule",
        "vratId",
        (service, parentId) => service.findByVrat(parentId, baseQuery),
        (service, parentId) => service.createChild(parentId, { foodName: "Fruit", allowed: true }, ACTOR_ID),
      );
      await runChildCrudSuite(
        ContentVersionsService,
        "contentVersion",
        "contentItemId",
        (service, parentId) => service.findByContentItem(parentId, baseQuery),
        (service, parentId) => service.createChild(parentId, { versionNumber: 1 }, ACTOR_ID),
      );
    });

    it("covers kaal services and me profile branches", async () => {
      const prisma = createMockPrisma();
      const kaalServices = [
        { ServiceClass: GulikaKaalService, delegateKey: "gulikaKaal", createMethod: "createGulikaKaal" },
        { ServiceClass: RahuKaalService, delegateKey: "rahuKaal", createMethod: "createRahuKaal" },
        { ServiceClass: YamagandaKaalService, delegateKey: "yamagandaKaal", createMethod: "createYamagandaKaal" },
      ] as const;

      for (const { ServiceClass, delegateKey, createMethod } of kaalServices) {
        const delegate = prisma[delegateKey] as ReturnType<typeof createMockDelegate>;
        const moduleRef = await Test.createTestingModule({
          providers: [
            ServiceClass,
            { provide: PrismaService, useValue: prisma },
            { provide: RelationValidationService, useValue: createMockRelationValidation() },
          ],
        }).compile();
        const service = moduleRef.get(ServiceClass) as Record<string, unknown>;
        delegate.findUnique.mockResolvedValueOnce({ id: UUID, panchangDateId: UUID2 });
        await service.findByPanchangDate(UUID, UUID2);
        delegate.findUnique.mockResolvedValueOnce(null);
        await service[createMethod](UUID, UUID2, {
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        });
      }

      const userProfilesService = {
        createProfile: jest.fn().mockResolvedValue({ id: UUID }),
        updateProfile: jest.fn().mockResolvedValue({ id: UUID }),
      };
      const userFavoritesService = {
        findAll: jest.fn().mockResolvedValue({ data: { items: [] } }),
        createFavorite: jest.fn().mockResolvedValue({ id: UUID }),
        deleteFavorite: jest.fn().mockResolvedValue({ id: UUID }),
      };
      const meModuleRef = await Test.createTestingModule({
        providers: [
          MeProfileService,
          MeFavoritesService,
          { provide: PrismaService, useValue: prisma },
          { provide: UserProfilesService, useValue: userProfilesService },
          { provide: UserFavoritesService, useValue: userFavoritesService },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const meProfile = meModuleRef.get(MeProfileService);
      const meFavorites = meModuleRef.get(MeFavoritesService);
      (prisma.userProfile as ReturnType<typeof createMockDelegate>).findUnique.mockResolvedValue({ id: UUID, userId: UUID });
      await meProfile.getProfile(UUID);
      (prisma.userProfile as ReturnType<typeof createMockDelegate>).findUnique.mockResolvedValue(null);
      await meProfile.updateProfile(UUID, { fullName: "User" });
      await meFavorites.findAll(UUID, baseQuery);
      (prisma.userFavorite as ReturnType<typeof createMockDelegate>).findUnique.mockResolvedValue({ id: UUID, userId: UUID });
      await meFavorites.remove(UUID, UUID);
    });

    it("covers storage service branches", () => {
      const storage = new StorageService();
      storage.onModuleInit();
      expect(storage.getUploadRootPath()).toBeDefined();
      expect(storage.buildRelativePath("temples", "file.png")).toContain("temples");
      expect(storage.resolveFolderFromRequest({ body: { folder: "temples" } })).toBe("temples");
      storage.deletePhysicalFile("temples/missing-file.png");
      storage.deleteUploadedFileIfExists("temples/missing-file.png");
    });

    it("covers panchang-date child and restore/status branches", async () => {
      const prisma = createMockPrisma();
      const choghadiyaDelegate = prisma.choghadiya as ReturnType<typeof createMockDelegate>;
      choghadiyaDelegate.findFirst.mockImplementation(async (args: { where?: Record<string, unknown> }) => {
        const where = args?.where ?? {};
        if (where.NOT || where.periodType) return null;
        if (where.id) return { id: UUID, panchangDateId: UUID2 };
        return null;
      });

      const choghadiyaModule = await Test.createTestingModule({
        providers: [
          ChoghadiyasService,
          { provide: PrismaService, useValue: prisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const choghadiyas = choghadiyaModule.get(ChoghadiyasService);

      await choghadiyas.findByPanchangDate(UUID, UUID2, baseQuery);
      await choghadiyas.createChild(
        UUID,
        UUID2,
        {
          periodType: "day",
          choghadiyaType: "amrit",
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        },
        ACTOR_ID,
      );
      await choghadiyas.updateChild(
        UUID,
        UUID2,
        UUID,
        {
          periodType: "day",
          choghadiyaType: "amrit",
          startTime: new Date().toISOString(),
        },
        ACTOR_ID,
      );
      await choghadiyas.deleteChild(UUID, UUID2, UUID, ACTOR_ID);

      const vratPrisma = createMockPrisma();
      const vratDelegate = vratPrisma.vratFoodRule as ReturnType<typeof createMockDelegate>;
      mockChildDelegateFindFirst(vratDelegate, "vratId");
      const vratModule = await Test.createTestingModule({
        providers: [
          VratFoodRulesService,
          { provide: PrismaService, useValue: vratPrisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const vratRules = vratModule.get(VratFoodRulesService);
      await vratRules.findByVrat(UUID, baseQuery);
      await vratRules.createChild(UUID, { foodName: "Fruit", allowed: true }, ACTOR_ID);
      await vratRules.updateChildStatus(UUID, UUID, Status.ARCHIVED, ACTOR_ID);
      await vratRules.restoreChild(UUID, UUID, ACTOR_ID);
    });

    it("covers optional relation validation and festival child branches", async () => {
      class StandaloneTempleChild extends TempleChildCrudService<Record<string, unknown>> {
        constructor(delegate: ReturnType<typeof createMockDelegate>) {
          super(delegate, { messageName: "Standalone", searchableFields: ["name"] });
        }
      }

      const delegate = createMockDelegate();
      mockChildDelegateFindFirst(delegate, "templeId");
      const standalone = new StandaloneTempleChild(delegate);
      await standalone.findByTemple(UUID, baseQuery);

      const festivalPrisma = createMockPrisma();
      const festivalMapsDelegate = festivalPrisma.festivalTempleMap as ReturnType<typeof createMockDelegate>;
      festivalMapsDelegate.findFirst.mockImplementation(async (args: { where?: Record<string, unknown> }) => {
        const where = args?.where ?? {};
        if (where.NOT || where.templeId) return null;
        if (where.id) return { id: UUID, festivalId: UUID };
        return null;
      });
      festivalMapsDelegate.delete.mockResolvedValue({ id: UUID, festivalId: UUID });

      const festivalMapsModule = await Test.createTestingModule({
        providers: [
          FestivalTempleMapsService,
          { provide: PrismaService, useValue: festivalPrisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const festivalMaps = festivalMapsModule.get(FestivalTempleMapsService);
      await festivalMaps.createChild(UUID, { templeId: UUID2 }, ACTOR_ID);
      await festivalMaps.deleteChild(UUID, UUID, ACTOR_ID);
      await expect(festivalMaps.restoreChild(UUID, UUID, ACTOR_ID)).rejects.toThrow(NotFoundException);

      const aartisPrisma = createMockPrisma();
      const aartisDelegate = aartisPrisma.festivalAarti as ReturnType<typeof createMockDelegate>;
      mockChildDelegateFindFirst(aartisDelegate, "festivalId");
      const aartisModule = await Test.createTestingModule({
        providers: [
          FestivalAartisService,
          { provide: PrismaService, useValue: aartisPrisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const festivalAartis = aartisModule.get(FestivalAartisService);
      await festivalAartis.findByFestival(UUID, { ...baseQuery, status: "ACTIVE", sortBy: "name" });
      await festivalAartis.createChild(UUID, { name: "Aarti" }, ACTOR_ID);
      await festivalAartis.updateChildStatus(UUID, UUID, Status.ARCHIVED, ACTOR_ID);
      await festivalAartis.restoreChild(UUID, UUID, ACTOR_ID);
      await festivalAartis.deleteChild(UUID, UUID, ACTOR_ID);

      const panchangPrisma = createMockPrisma();
      const panchangDelegate = panchangPrisma.panchangRegion as ReturnType<typeof createMockDelegate>;
      panchangDelegate.findFirst.mockImplementation(async (args: { where?: Record<string, unknown> }) => {
        const where = args?.where ?? {};
        if (where.NOT) return null;
        if (where.id) {
          return {
            id: UUID,
            panchangId: UUID,
            countryId: UUID2,
            stateId: UUID2,
            cityId: UUID2,
          };
        }
        return null;
      });
      panchangDelegate.delete.mockResolvedValue({ id: UUID, panchangId: UUID });
      const panchangModule = await Test.createTestingModule({
        providers: [
          PanchangRegionsService,
          { provide: PrismaService, useValue: panchangPrisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const panchangRegions = panchangModule.get(PanchangRegionsService);
      await panchangRegions.findByPanchang(UUID, baseQuery);
      await panchangRegions.createChild(
        UUID,
        { regionName: "North", countryId: UUID2, stateId: UUID2, cityId: UUID2 },
        ACTOR_ID,
      );
      await panchangRegions.updateChild(UUID, UUID, { regionName: "Updated" }, ACTOR_ID);
      await panchangRegions.deleteChild(UUID, UUID, ACTOR_ID);
      await expect(panchangRegions.restoreChild(UUID, UUID, ACTOR_ID)).rejects.toThrow(NotFoundException);

      const deityPrisma = createMockPrisma();
      const deityDelegate = deityPrisma.deityExternalLink as ReturnType<typeof createMockDelegate>;
      mockChildDelegateFindFirst(deityDelegate, "deityId");
      const deityModule = await Test.createTestingModule({
        providers: [
          DeityExternalLinksService,
          { provide: PrismaService, useValue: deityPrisma },
          { provide: RelationValidationService, useValue: createMockRelationValidation() },
        ],
      }).compile();
      const deityLinks = deityModule.get(DeityExternalLinksService);
      await deityLinks.updateChildStatus(UUID, UUID, Status.ARCHIVED, ACTOR_ID);
      await deityLinks.restoreChild(UUID, UUID, ACTOR_ID);
    });
  });
});
