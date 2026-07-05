import { ConflictException, NotFoundException } from "@nestjs/common";

type MockRecord = Record<string, unknown>;

export function createMockDelegate(overrides: MockRecord = {}) {
  const base: MockRecord = {
    id: "00000000-0000-4000-8000-000000000001",
    deletedAt: null,
    status: "ACTIVE",
    slug: "test-slug",
    countryId: "00000000-0000-4000-8000-000000000002",
    stateId: "00000000-0000-4000-8000-000000000003",
    cityId: "00000000-0000-4000-8000-000000000004",
    areaId: "00000000-0000-4000-8000-000000000005",
    templeId: "00000000-0000-4000-8000-000000000006",
    festivalId: "00000000-0000-4000-8000-000000000007",
    deityTypeId: "00000000-0000-4000-8000-000000000008",
    deityId: "00000000-0000-4000-8000-000000000009",
    panchangId: "00000000-0000-4000-8000-000000000010",
    vratId: "00000000-0000-4000-8000-000000000011",
    contentTypeId: "00000000-0000-4000-8000-000000000012",
    contentItemId: "00000000-0000-4000-8000-000000000013",
    userId: "00000000-0000-4000-8000-000000000014",
    name: "Test",
    title: "Test",
    ...overrides,
  };

  return {
    create: jest.fn().mockResolvedValue(base),
    update: jest.fn().mockResolvedValue(base),
    findFirst: jest.fn().mockResolvedValue(base),
    findUnique: jest.fn().mockResolvedValue(base),
    findMany: jest.fn().mockResolvedValue([base]),
    count: jest.fn().mockResolvedValue(1),
    delete: jest.fn().mockResolvedValue(base),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
  };
}

export function createMockPrisma(
  extraDelegates: Record<string, ReturnType<typeof createMockDelegate>> = {},
): Record<string, unknown> {
  const cache = new Map<string, ReturnType<typeof createMockDelegate>>();

  return new Proxy(
    {
      $transaction: jest.fn(async (callback: (tx: Record<string, unknown>) => Promise<unknown>) =>
        callback(createMockPrisma(extraDelegates) as Record<string, unknown>),
      ),
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    },
    {
      get(target, prop: string) {
        if (prop in target) {
          return (target as Record<string, unknown>)[prop];
        }

        if (extraDelegates[prop]) {
          return extraDelegates[prop];
        }

        if (!cache.has(prop)) {
          cache.set(prop, createMockDelegate());
        }

        return cache.get(prop);
      },
    },
  ) as Record<string, unknown>;
}

export function createMockRelationValidation() {
  return {
    validateForeignKeys: jest.fn().mockResolvedValue(undefined),
    validateUserEntity: jest.fn().mockResolvedValue(undefined),
    validatePanchangDateHierarchy: jest.fn().mockResolvedValue(undefined),
    validateContentGalleryHierarchy: jest.fn().mockResolvedValue(undefined),
    validateContentMediaHierarchy: jest.fn().mockResolvedValue(undefined),
    validateStateHierarchy: jest.fn().mockResolvedValue(undefined),
    validateCityHierarchy: jest.fn().mockResolvedValue(undefined),
    validateAreaHierarchy: jest.fn().mockResolvedValue(undefined),
    validateTempleLocationHierarchy: jest.fn().mockResolvedValue(undefined),
  };
}

export function createMockConfigService(values: Record<string, unknown> = {}) {
  const defaults: Record<string, unknown> = {
    "auth.jwtAccessExpiresIn": "15m",
    "auth.jwtRefreshExpiresIn": "7d",
    "auth.jwtAccessSecret": "test-access-secret-minimum-32-characters",
    "auth.jwtRefreshSecret": "test-refresh-secret-minimum-32-characters",
    "otp.expiresIn": "5m",
    "otp.maxRetries": 5,
    "otp.verificationTokenExpiresIn": "10m",
    ...values,
  };

  return {
    get: jest.fn((key: string) => defaults[key]),
    getOrThrow: jest.fn((key: string) => {
      if (!(key in defaults)) {
        throw new Error(`Missing config ${key}`);
      }
      return defaults[key];
    }),
  };
}

export function createMockJwtService() {
  return {
    signAsync: jest.fn().mockResolvedValue("signed-token"),
    verifyAsync: jest.fn().mockResolvedValue({
      sub: "00000000-0000-4000-8000-000000000001",
      mobile: "+919876543210",
      purpose: "LOGIN",
      type: "otp_verification",
    }),
  };
}

export const TEST_ID = "00000000-0000-4000-8000-000000000001";
export const ACTOR_ID = "00000000-0000-4000-8000-000000000099";

export const baseQuery = { page: 1, limit: 10, sortBy: undefined, sortOrder: "desc" };

export function expectNotFound(promise: Promise<unknown>) {
  return expect(promise).rejects.toThrow(NotFoundException);
}

export function expectConflict(promise: Promise<unknown>) {
  return expect(promise).rejects.toThrow(ConflictException);
}

export function createErrorMockPrisma(
  extraDelegates: Record<string, ReturnType<typeof createMockDelegate>> = {},
): Record<string, unknown> {
  const errorDelegate = () => ({
    create: jest.fn().mockRejectedValue({ code: "P2002" }),
    update: jest.fn().mockRejectedValue({ code: "P2025" }),
    findFirst: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    delete: jest.fn().mockRejectedValue({ code: "P2025" }),
    updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  });

  const cache = new Map<string, ReturnType<typeof errorDelegate>>();

  return new Proxy(
    {
      $transaction: jest.fn(async (callback: (tx: Record<string, unknown>) => Promise<unknown>) =>
        callback(createErrorMockPrisma(extraDelegates) as Record<string, unknown>),
      ),
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    },
    {
      get(target, prop: string) {
        if (prop in target) {
          return (target as Record<string, unknown>)[prop];
        }
        if (extraDelegates[prop]) {
          return extraDelegates[prop];
        }
        if (!cache.has(prop)) {
          cache.set(prop, errorDelegate());
        }
        return cache.get(prop);
      },
    },
  ) as Record<string, unknown>;
}

export function createDepMock() {
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === "then") return undefined;
        return jest.fn().mockResolvedValue({ id: TEST_ID, success: true, data: { id: TEST_ID } });
      },
    },
  );
}
