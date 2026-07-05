// @ts-nocheck
import { NotFoundException } from "@nestjs/common";
import { Prisma, Status } from "@prisma/client";
import {
  activeStatusWhere,
  legacyPublishedWhere,
  publicFindById,
  publicFindBySlug,
  publicFindMany,
  publishedAtWhere,
  sanitizePublicRecord,
} from "../../src/modules/public/common/public-response.util";

describe("public-response.util", () => {
  it("sanitizePublicRecord strips internal fields", () => {
    const sanitized = sanitizePublicRecord({
      id: "temple-1",
      name: "Public Temple",
      deletedAt: null,
      createdBy: "admin-1",
      updatedBy: "admin-2",
      searchKeywords: "hidden",
      templeCode: "TMP001",
    });

    expect(sanitized).toEqual({
      id: "temple-1",
      name: "Public Temple",
    });
    expect(sanitized).not.toHaveProperty("createdBy");
    expect(sanitized).not.toHaveProperty("deletedAt");
    expect(sanitized).not.toHaveProperty("templeCode");
  });

  it("activeStatusWhere returns active non-deleted filter", () => {
    expect(activeStatusWhere()).toEqual({
      deletedAt: null,
      status: Status.ACTIVE,
    });
  });

  it("covers public query helpers", async () => {
    const delegate = {
      findMany: jest.fn().mockResolvedValue([{ id: "1", slug: "test", createdBy: "admin" }]),
      count: jest.fn().mockResolvedValue(1),
      findFirst: jest.fn().mockResolvedValue({ id: "1", slug: "test", createdBy: "admin" }),
    };

    await publicFindMany(
      delegate,
      { page: 1, limit: 10, search: "test", filters: { countryId: "c1", unknown: "x" }, sortBy: "name", sortOrder: "desc" },
      activeStatusWhere(),
      { searchableFields: ["name", "slug"], allowedFilterFields: ["countryId"], allowedSortFields: ["name"] },
    );

    await publicFindBySlug(delegate, "test", activeStatusWhere(), "Fetched");
    await publicFindById(delegate, "1", activeStatusWhere(), "Fetched");
    expect(publishedAtWhere().publishedAt).toBeDefined();
    expect(legacyPublishedWhere().status).toBe("published");

    delegate.findFirst.mockResolvedValue(null);
    await expect(publicFindBySlug(delegate, "missing", activeStatusWhere(), "Fetched")).rejects.toThrow(
      NotFoundException,
    );

    expect(
      sanitizePublicRecord({
        id: "1",
        amount: new Prisma.Decimal("1.5"),
        count: BigInt(10),
      }).amount,
    ).toBe("1.5");
  });
});
