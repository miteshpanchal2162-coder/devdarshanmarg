import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserEntityType } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "./relation-validation.service";

describe("RelationValidationService", () => {
  let service: RelationValidationService;
  let prisma: {
    user: { findFirst: jest.Mock };
    temple: { findFirst: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { findFirst: jest.fn() },
      temple: { findFirst: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationValidationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(RelationValidationService);
  });

  it("validateForeignKeys throws NotFoundException for invalid userId", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(service.validateForeignKeys({ userId: "missing-user" })).rejects.toThrow(
      new NotFoundException("User not found"),
    );
  });

  it("validateUserEntity validates TEMPLE entity", async () => {
    prisma.temple.findFirst.mockResolvedValue(null);

    await expect(
      service.validateUserEntity(UserEntityType.TEMPLE, "missing-temple"),
    ).rejects.toThrow(new NotFoundException("Temple not found"));

    prisma.temple.findFirst.mockResolvedValue({ id: "temple-1" });

    await expect(
      service.validateUserEntity(UserEntityType.TEMPLE, "temple-1"),
    ).resolves.toBeUndefined();
  });
});
