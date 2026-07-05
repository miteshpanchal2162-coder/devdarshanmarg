import {
  BadRequestException,
  ConflictException,
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { existsSync } from "fs";
import { firstValueFrom, of, throwError } from "rxjs";
import { resolvePrismaError, handlePrismaError } from "../../src/common/exceptions/prisma-error.handler";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { RequestLoggingInterceptor } from "../../src/common/interceptors/request-logging.interceptor";
import { ResponseInterceptor } from "../../src/common/interceptors/response.interceptor";
import {
  validateFileName,
  validateUploadedFile,
} from "../../src/common/storage/file-validation.util";
import { serializeValue } from "../../src/common/utils/serialization.util";
import { envValidationSchema } from "../../src/config/env.validation";
import { HealthService } from "../../src/modules/health/health.service";

jest.mock("fs", () => ({
  ...jest.requireActual<typeof import("fs")>("fs"),
  closeSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
  openSync: jest.fn().mockReturnValue(1),
  readSync: jest.fn(),
}));

describe("production hardening", () => {
  describe("serializeValue", () => {
    it("serializes BigInt, Decimal, and Date values", () => {
      const date = new Date("2026-01-01T00:00:00.000Z");
      expect(serializeValue(42n)).toBe("42");
      expect(serializeValue(new Prisma.Decimal("12.34"))).toBe("12.34");
      expect(serializeValue(date)).toBe("2026-01-01T00:00:00.000Z");
      expect(
        serializeValue({
          amount: new Prisma.Decimal("1.5"),
          count: 2n,
          createdAt: date,
          nested: [{ value: 3n }],
        }),
      ).toEqual({
        amount: "1.5",
        count: "2",
        createdAt: "2026-01-01T00:00:00.000Z",
        nested: [{ value: "3" }],
      });
    });
  });

  describe("resolvePrismaError", () => {
    it("maps all required Prisma error codes", () => {
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("dup", { code: "P2002", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(ConflictException);
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("fk", { code: "P2003", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(BadRequestException);
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("rel", { code: "P2014", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(BadRequestException);
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("query", { code: "P2016", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(BadRequestException);
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("missing", { code: "P2025", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(NotFoundException);
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("table", { code: "P2021", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(InternalServerErrorException);
      expect(
        resolvePrismaError(
          new Prisma.PrismaClientKnownRequestError("column", { code: "P2022", clientVersion: "1" }),
        ),
      ).toBeInstanceOf(InternalServerErrorException);
      expect(
        resolvePrismaError(new Prisma.PrismaClientValidationError("bad", { clientVersion: "1" })),
      ).toBeInstanceOf(BadRequestException);
      expect(
        resolvePrismaError(new Prisma.PrismaClientInitializationError("db", "1")),
      ).toBeInstanceOf(InternalServerErrorException);
      expect(
        resolvePrismaError(new Prisma.PrismaClientRustPanicError("panic", "1")),
      ).toBeInstanceOf(InternalServerErrorException);
      expect(resolvePrismaError(new Error("other"))).toBeNull();
    });

    it("does not expose raw Prisma messages", () => {
      const mapped = resolvePrismaError(
        new Prisma.PrismaClientKnownRequestError("raw prisma text", {
          code: "P2002",
          clientVersion: "1",
        }),
      ) as ConflictException;
      expect(mapped.getResponse()).toEqual({
        message: "A record with this unique value already exists",
        statusCode: 409,
        error: "Conflict",
      });
    });
  });

  describe("upload security", () => {
    it("rejects null bytes, traversal, and double extensions", () => {
      expect(() => validateFileName("photo\0.png")).toThrow(BadRequestException);
      expect(() => validateFileName("../photo.png")).toThrow(BadRequestException);
      expect(() => validateFileName("photo.php.png")).toThrow(BadRequestException);
    });

    it("rejects magic-byte mismatches", () => {
      const { readSync } = jest.requireMock<{ readSync: jest.Mock }>("fs");
      readSync.mockImplementation((_fd, buffer: Buffer) => {
        buffer.fill(0);
        return 16;
      });

      expect(() =>
        validateUploadedFile(
          {
            mimetype: "image/png",
            originalname: "photo.png",
            size: 1024,
            path: "/tmp/photo.png",
          },
          "image",
        ),
      ).toThrow("File content does not match the declared file type");
    });
  });

  describe("request logging interceptor", () => {
    it("logs method, url, duration, status, ip, and user id", async () => {
      const interceptor = new RequestLoggingInterceptor();
      const logSpy = jest.spyOn(interceptor["logger"], "log");
      const context = {
        getType: () => "http",
        switchToHttp: () => ({
          getRequest: () => ({
            ip: "127.0.0.1",
            method: "get",
            originalUrl: "/health",
            user: { id: "user-1" },
          }),
          getResponse: () => ({ statusCode: 200 }),
        }),
      } as unknown as ExecutionContext;

      await firstValueFrom(
        interceptor.intercept(context, {
          handle: () => of({ ok: true }),
        }),
      );

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"method":"GET"'),
      );
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"url":"/health"'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"status":200'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"ip":"127.0.0.1"'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"userId":"user-1"'));
    });

    it("logs error status codes", async () => {
      const interceptor = new RequestLoggingInterceptor();
      const logSpy = jest.spyOn(interceptor["logger"], "log");
      const context = {
        getType: () => "http",
        switchToHttp: () => ({
          getRequest: () => ({ method: "POST", url: "/auth/login" }),
          getResponse: () => ({ statusCode: 500 }),
        }),
      } as unknown as ExecutionContext;

      await expect(
        firstValueFrom(
          interceptor.intercept(context, {
            handle: () => throwError(() => ({ status: 401 })),
          }),
        ),
      ).rejects.toEqual({ status: 401 });

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"status":401'));
    });
  });

  describe("health service", () => {
    it("returns application, database, storage, uptime, version, memory, and timestamp", async () => {
      const prisma = {
        $queryRaw: jest.fn().mockResolvedValue([{ "?column?": 1 }]),
      };
      const service = new HealthService(prisma as never);
      const result = await service.check();

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(existsSync).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.application).toBeDefined();
      expect(result.database).toEqual({ status: "up" });
      expect(result.storage?.status).toBe("up");
      expect(result.uptime).toBeGreaterThanOrEqual(0);
      expect(result.version).toBeDefined();
      expect(result.memory.heapUsed).toBeGreaterThan(0);
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("marks health as degraded when database is down", async () => {
      const prisma = {
        $queryRaw: jest.fn().mockRejectedValue(new Error("db down")),
      };
      const service = new HealthService(prisma as never);
      const result = await service.check();

      expect(result.status).toBe("degraded");
      expect(result.database).toEqual({ status: "down" });
    });
  });

  describe("response interceptor integration", () => {
    it("serializes BigInt values in wrapped responses", async () => {
      const interceptor = new ResponseInterceptor();
      const wrapped = await firstValueFrom(
        interceptor.intercept({} as ExecutionContext, {
          handle: () => of({ count: 5n }),
        }),
      );
      expect(wrapped.data).toEqual({ count: "5" });
    });
  });

  describe("all exceptions filter prisma mapping", () => {
    it("maps prisma errors before building the response", () => {
      const filter = new AllExceptionsFilter();
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });

      filter.catch(
        new Prisma.PrismaClientKnownRequestError("missing", { code: "P2025", clientVersion: "1" }),
        {
          switchToHttp: () => ({
            getResponse: () => ({ status }),
            getRequest: () => ({ url: "/items/1" }),
          }),
        } as never,
      );

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Record not found",
        }),
      );
    });
  });

  describe("env validation", () => {
    it("requires upload path in production", () => {
      const { error } = envValidationSchema.validate({
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
        JWT_ACCESS_SECRET: "a".repeat(32),
        JWT_REFRESH_SECRET: "b".repeat(32),
        CORS_ORIGIN: "https://example.com",
      });

      expect(error?.details?.[0]?.context?.message).toContain(
        "UPLOAD_DIR or UPLOAD_PATH is required in production",
      );
    });

    it("accepts UPLOAD_PATH alias in production", () => {
      const { error } = envValidationSchema.validate({
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
        JWT_ACCESS_SECRET: "a".repeat(32),
        JWT_REFRESH_SECRET: "b".repeat(32),
        CORS_ORIGIN: "https://example.com",
        UPLOAD_PATH: "/var/uploads",
      });

      expect(error).toBeUndefined();
    });
  });

  it("handlePrismaError rethrows unmapped errors", () => {
    expect(() => handlePrismaError(new Error("unknown"))).toThrow("unknown");
  });
});
