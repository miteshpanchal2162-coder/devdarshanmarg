import { NotFoundException } from "@nestjs/common";
import { BaseQueryDto } from "../dto/base-query.dto";
import { BaseCrudService } from "./base-crud.service";

type TestRecord = {
  id: string;
  name: string;
  deletedAt: Date | null;
};

type TestDelegate = {
  create: jest.Mock;
  update: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  count: jest.Mock;
};

class TestCrudService extends BaseCrudService<TestRecord> {
  constructor(delegate: TestDelegate) {
    super(delegate, ["name"], ["name"], ["name"]);
  }
}

describe("BaseCrudService", () => {
  const mockRecord: TestRecord = {
    id: "record-1",
    name: "Test",
    deletedAt: null,
  };

  let delegate: TestDelegate;
  let service: TestCrudService;

  beforeEach(() => {
    delegate = {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    };
    service = new TestCrudService(delegate);
  });

  it("creates a record", async () => {
    delegate.create.mockResolvedValue(mockRecord);

    await expect(service.create({ name: "Test" })).resolves.toEqual(mockRecord);
    expect(delegate.create).toHaveBeenCalledWith({ data: { name: "Test" } });
  });

  it("updates a record", async () => {
    const updated = { ...mockRecord, name: "Updated" };
    delegate.update.mockResolvedValue(updated);

    await expect(service.update("record-1", { name: "Updated" })).resolves.toEqual(updated);
    expect(delegate.update).toHaveBeenCalledWith({
      where: { id: "record-1" },
      data: { name: "Updated" },
    });
  });

  it("soft deletes a record with deletedAt", async () => {
    delegate.findFirst.mockResolvedValue(mockRecord);
    delegate.update.mockResolvedValue({ ...mockRecord, deletedAt: new Date("2026-01-01") });

    await service.delete("record-1");

    expect(delegate.update).toHaveBeenCalledWith({
      where: { id: "record-1" },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it("restores a soft-deleted record", async () => {
    delegate.findFirst.mockResolvedValue({ ...mockRecord, deletedAt: new Date("2026-01-01") });
    delegate.update.mockResolvedValue(mockRecord);

    await expect(service.restore("record-1")).resolves.toEqual(mockRecord);
    expect(delegate.update).toHaveBeenCalledWith({
      where: { id: "record-1" },
      data: { deletedAt: null },
    });
  });

  it("findOne returns an active record", async () => {
    delegate.findFirst.mockResolvedValue(mockRecord);

    await expect(service.findOne("record-1")).resolves.toEqual(mockRecord);
    expect(delegate.findFirst).toHaveBeenCalledWith({ where: { id: "record-1" } });
  });

  it("findOne throws when record is soft deleted", async () => {
    delegate.findFirst.mockResolvedValue({ ...mockRecord, deletedAt: new Date("2026-01-01") });

    await expect(service.findOne("record-1")).rejects.toThrow(NotFoundException);
  });

  it("findMany returns paginated results", async () => {
    delegate.findFirst.mockResolvedValue(null);
    delegate.findMany.mockResolvedValue([mockRecord]);
    delegate.count.mockResolvedValue(1);

    const query = Object.assign(new BaseQueryDto(), { page: 1, limit: 10 });
    const result = await service.findMany(query);

    expect(result.items).toEqual([mockRecord]);
    expect(result.meta.total).toBe(1);
    expect(delegate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
        skip: 0,
        take: 10,
      }),
    );
  });
});
