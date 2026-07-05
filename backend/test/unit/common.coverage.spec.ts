import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { firstValueFrom, of } from "rxjs";
import { RolesGuard } from "../../src/common/guards/roles.guard";
import { ResponseInterceptor } from "../../src/common/interceptors/response.interceptor";
import { createApiResponse, createPaginatedResponse } from "../../src/common/services/api-response.service";
import { handlePrismaError } from "../../src/common/exceptions/prisma-error.handler";
import {
  buildActivityDetails,
  extractEntityId,
  extractUserId,
  isMutationMethod,
  resolveActivityAction,
  resolveEntityType,
  shouldSkipActivityLogPath,
} from "../../src/common/utils/activity-log.util";
import { addDurationToNow } from "../../src/common/utils/duration.util";
import { hashOtp, verifyOtpHash } from "../../src/common/utils/otp-hash.util";
import { generateOtpCode } from "../../src/common/utils/otp.util";
import { createPaginationMeta, getPagination } from "../../src/common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
  buildStatusFilter,
} from "../../src/common/utils/query.util";
import {
  activeStatusWhere,
  legacyPublishedWhere,
  publishedAtWhere,
  sanitizePublicRecord,
} from "../../src/modules/public/common/public-response.util";

describe("common utilities", () => {
  it("covers pagination helpers", () => {
    expect(getPagination(1, 10)).toEqual({ page: 1, limit: 10, skip: 0, take: 10 });
    expect(createPaginationMeta(1, 10, 25)).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it("covers query helpers", () => {
    expect(buildSearchFilter("test", ["name"])).toEqual({
      OR: [{ name: { contains: "test", mode: "insensitive" } }],
    });
    expect(buildStatusFilter("ACTIVE")).toEqual({ status: "ACTIVE" });
    expect(buildFieldFilters({ status: "ACTIVE" })).toEqual({ status: "ACTIVE" });
    expect(buildOrderBy("name", "asc" as never)).toEqual({ name: "asc" });
  });

  it("covers activity log helpers", () => {
    expect(isMutationMethod("POST")).toBe(true);
    expect(isMutationMethod("GET")).toBe(false);
    expect(shouldSkipActivityLogPath("/public/temples")).toBe(true);
    expect(resolveActivityAction("POST", "/auth/login", {})).toBe("LOGIN");
    expect(resolveActivityAction("POST", "/auth/verify-otp", {})).toBe("OTP VERIFIED");
    expect(resolveEntityType("/temples/:id")).toBe("Temple");
    expect(
      extractEntityId({ data: { id: "00000000-0000-4000-8000-000000000001" } }, {}),
    ).toBe("00000000-0000-4000-8000-000000000001");
    expect(
      extractUserId(undefined, { data: { user: { id: "00000000-0000-4000-8000-000000000001" } } }, "LOGIN"),
    ).toBe("00000000-0000-4000-8000-000000000001");
    expect(buildActivityDetails({ method: "POST", path: "/auth/login", userAgent: "jest" }).userAgent).toBe(
      "jest",
    );
  });

  it("covers otp helpers", () => {
    const otp = generateOtpCode();
    expect(otp).toMatch(/^[0-9]{6}$/);
    const hashed = hashOtp("123456");
    expect(verifyOtpHash(hashed, "123456")).toBe(true);
    expect(verifyOtpHash(hashed, "000000")).toBe(false);
    expect(addDurationToNow("5m").getTime()).toBeGreaterThan(Date.now());
  });

  it("covers api response helpers", () => {
    expect(createApiResponse("ok", { id: 1 })).toEqual({
      success: true,
      message: "ok",
      data: { id: 1 },
    });
    expect(createPaginatedResponse([{ id: 1 }], createPaginationMeta(1, 10, 1)).data.items).toHaveLength(1);
  });

  it("covers public response helpers", () => {
    const sanitized = sanitizePublicRecord({
      id: "1",
      slug: "test",
      createdBy: "admin",
      deletedAt: null,
    });
    expect(sanitized.createdBy).toBeUndefined();
    expect(activeStatusWhere()).toEqual({ deletedAt: null, status: "ACTIVE" });
    expect(publishedAtWhere().publishedAt).toBeDefined();
    expect(legacyPublishedWhere().status).toBe("published");
  });

  it("covers prisma error handler branches", () => {
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("duplicate", { code: "P2002", clientVersion: "1" })),
    ).toThrow();
    expect(() =>
      handlePrismaError(new Prisma.PrismaClientKnownRequestError("missing", { code: "P2025", clientVersion: "1" })),
    ).toThrow(NotFoundException);
  });
});

describe("common guards and interceptors", () => {
  it("roles guard enforces role metadata", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue([UserRole.ADMIN]) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.USER } }),
      }),
    } as unknown as ExecutionContext;
    expect(guard.canActivate(context)).toBe(false);
  });

  it("roles guard allows matching roles and open routes", () => {
    const openReflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) } as unknown as Reflector;
    const openGuard = new RolesGuard(openReflector);
    expect(
      openGuard.canActivate({
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({ getRequest: () => ({}) }),
      } as unknown as ExecutionContext),
    ).toBe(true);

    const adminReflector = { getAllAndOverride: jest.fn().mockReturnValue([UserRole.ADMIN]) } as unknown as Reflector;
    const adminGuard = new RolesGuard(adminReflector);
    expect(
      adminGuard.canActivate({
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({ getRequest: () => ({ user: { role: UserRole.ADMIN } }) }),
      } as unknown as ExecutionContext),
    ).toBe(true);
  });

  it("response interceptor wraps successful payloads", async () => {
    const interceptor = new ResponseInterceptor();
    const preWrapped = await firstValueFrom(
      interceptor.intercept({} as ExecutionContext, {
        handle: () => of({ success: true, message: "ok", data: { id: 1 } }),
      }),
    );
    expect(preWrapped).toEqual({ success: true, message: "ok", data: { id: 1 } });

    const wrapped = await firstValueFrom(
      interceptor.intercept({} as ExecutionContext, {
        handle: () => of({ id: 1 }),
      }),
    );
    expect(wrapped.success).toBe(true);
    expect(wrapped.message).toBe("Request successful");
    expect(wrapped.data).toEqual({ id: 1 });
  });

  it("all exceptions filter maps http exceptions", () => {
    const filter = new AllExceptionsFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    filter.catch(new UnauthorizedException("denied"), {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: "/test" }),
      }),
    } as never);
    expect(status).toHaveBeenCalledWith(401);

    const json2 = jest.fn();
    const status2 = jest.fn().mockReturnValue({ json: json2 });
    filter.catch(new BadRequestException({ message: ["a", "b"], error: "Bad Request" }), {
      switchToHttp: () => ({
        getResponse: () => ({ status: status2 }),
        getRequest: () => ({ url: "/test" }),
      }),
    } as never);
    expect(status2).toHaveBeenCalledWith(400);
  });
});
