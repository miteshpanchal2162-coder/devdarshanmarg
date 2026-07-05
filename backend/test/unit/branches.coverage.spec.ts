import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma, Status } from "@prisma/client";
import { BaseQueryDto } from "../../src/common/dto/base-query.dto";
import { addDurationToNow } from "../../src/common/utils/duration.util";
import { handlePrismaError } from "../../src/common/exceptions/prisma-error.handler";
import { BaseCrudService } from "../../src/common/services/base-crud.service";
import {
  buildActivityDetails,
  extractEntityId,
  extractUserId,
  resolveActivityAction,
  resolveEntityType,
  shouldSkipActivityLogPath,
} from "../../src/common/utils/activity-log.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
  buildStatusFilter,
} from "../../src/common/utils/query.util";
import {
  validateAnySupportedFile,
  validateDocumentFile,
  validateFileName,
  validateImageFile,
  validateUploadedFile,
} from "../../src/common/storage/file-validation.util";
import {
  resolveStorageFolder,
  sanitizeRelativeStoragePath,
} from "../../src/common/storage/storage.constants";

type StatusRecord = { id: string; status: Status; deletedAt?: null };
type SoftRecord = { id: string; deletedAt: Date | null };

class StatusCrudService extends BaseCrudService<StatusRecord> {
  constructor(delegate: { create: jest.Mock; update: jest.Mock; findFirst: jest.Mock; findMany: jest.Mock; count: jest.Mock }) {
    super(delegate, ["name"], ["name"], ["status"]);
  }
}

class HardDeleteCrudService extends BaseCrudService<{ id: string }> {
  constructor(
    delegate: {
      create: jest.Mock;
      update: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      delete: jest.Mock;
    },
  ) {
    super(delegate, ["name"], ["name"], ["status"]);
  }
}

describe("Branch coverage expansion", () => {
  it("covers prisma error branches", () => {
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("dup", { code: "P2002", clientVersion: "1" })),
    ).toThrow(ConflictException);
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("fk", { code: "P2003", clientVersion: "1" })),
    ).toThrow(BadRequestException);
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("missing", { code: "P2025", clientVersion: "1" })),
    ).toThrow(NotFoundException);
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("rel", { code: "P2014", clientVersion: "1" })),
    ).toThrow(BadRequestException);
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("query", { code: "P2016", clientVersion: "1" })),
    ).toThrow(BadRequestException);
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("table", { code: "P2021", clientVersion: "1" })),
    ).toThrow(InternalServerErrorException);
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("column", { code: "P2022", clientVersion: "1" })),
    ).toThrow(InternalServerErrorException);
    expect(() => handlePrismaError(new Prisma.PrismaClientValidationError("bad", { clientVersion: "1" }))).toThrow(
      BadRequestException,
    );
    expect(() => handlePrismaError(new Error("unknown"))).toThrow("unknown");
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("other", { code: "P2000", clientVersion: "1" })),
    ).toThrow();
  });

  it("covers base crud delete branches", async () => {
    const statusDelegate = {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn().mockResolvedValue({ id: "1", status: Status.ACTIVE }),
      findMany: jest.fn(),
      count: jest.fn(),
    };
    const statusService = new StatusCrudService(statusDelegate);
    await statusService.delete("1");
    expect(statusDelegate.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { status: "ARCHIVED" },
    });

    const hardDelegate = {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn().mockResolvedValue({ id: "1" }),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn().mockResolvedValue({ id: "1" }),
    };
    const hardService = new HardDeleteCrudService(hardDelegate);
    await hardService.delete("1");
    expect(hardDelegate.delete).toHaveBeenCalled();
  });

  it("covers query and activity branches", () => {
    expect(buildSearchFilter(undefined, ["name"])).toBeUndefined();
    expect(buildStatusFilter(undefined)).toBeUndefined();
    expect(buildFieldFilters({ status: "ACTIVE", empty: "" })).toEqual({ status: "ACTIVE" });
    expect(buildOrderBy(undefined, undefined)).toBeUndefined();
    expect(shouldSkipActivityLogPath("/health")).toBe(true);
    expect(resolveActivityAction("PATCH", "/users/1/status", { status: "ARCHIVED" })).toBe("ARCHIVE");
    expect(resolveActivityAction("PUT", "/users/1", { password: "secret" })).toBe("PASSWORD CHANGE");
    expect(resolveEntityType("/users/00000000-0000-4000-8000-000000000001/restore")).toBe("User");
    expect(extractEntityId(null, { id: "00000000-0000-4000-8000-000000000001" })).toBe(
      "00000000-0000-4000-8000-000000000001",
    );
    expect(extractUserId("user-1", null, "UPDATE")).toBe("user-1");
    expect(buildActivityDetails({ method: "GET", path: "/x" }).timestamp).toBeDefined();
  });

  it("covers upload validation branches", () => {
    expect(() => validateUploadedFile(undefined as never, "image")).toThrow(BadRequestException);
    expect(() =>
      validateUploadedFile({ mimetype: "image/png", originalname: "a.png", size: 30_000_000 }, "image"),
    ).toThrow(BadRequestException);
    expect(() => validateImageFile("text/plain", "txt")).toThrow(BadRequestException);
    expect(() => validateDocumentFile("text/plain", "txt")).toThrow(BadRequestException);
    expect(() => validateAnySupportedFile("text/plain", "txt")).toThrow(BadRequestException);
    expect(() => resolveStorageFolder({ body: { folder: "invalid" } })).toThrow(BadRequestException);
    expect(() => sanitizeRelativeStoragePath("../bad/path")).toThrow(BadRequestException);
    expect(sanitizeRelativeStoragePath("temples/file.png")).toBe("temples/file.png");
    expect(() => validateFileName("photo\0.png")).toThrow(BadRequestException);
    expect(() => validateFileName("photo.php.png")).toThrow(BadRequestException);
  });

  it("covers base query dto defaults", () => {
    const query = new BaseQueryDto();
    expect(query.page).toBe(1);
  });

  it("covers duration util unit branches", () => {
    expect(addDurationToNow("1h").getTime()).toBeGreaterThan(Date.now());
    expect(addDurationToNow("30s").getTime()).toBeGreaterThan(Date.now());
    expect(addDurationToNow("2d").getTime()).toBeGreaterThan(Date.now());
    expect(addDurationToNow("invalid", "1h").getTime()).toBeGreaterThan(Date.now());
  });
});
