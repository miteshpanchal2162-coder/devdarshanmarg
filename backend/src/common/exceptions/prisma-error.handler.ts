import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new ConflictException("A record with this unique value already exists");
    }

    if (error.code === "P2003") {
      throw new BadRequestException("Invalid relation reference");
    }

    if (error.code === "P2025") {
      throw new NotFoundException("Record not found");
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException("Invalid query or payload");
  }

  throw error;
}
