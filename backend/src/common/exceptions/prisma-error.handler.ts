import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

const PRISMA_ERROR_MESSAGES: Record<string, string> = {
  P2002: "A record with this unique value already exists",
  P2003: "Invalid relation reference",
  P2014: "The requested change violates a required relation",
  P2016: "Query interpretation error",
  P2021: "The requested table does not exist",
  P2022: "The requested column does not exist",
  P2025: "Record not found",
};

export function resolvePrismaError(error: unknown): HttpException | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const message = PRISMA_ERROR_MESSAGES[error.code];

    if (error.code === "P2002") {
      return new ConflictException(message);
    }

    if (error.code === "P2003" || error.code === "P2014" || error.code === "P2016") {
      return new BadRequestException(message);
    }

    if (error.code === "P2025") {
      return new NotFoundException(message);
    }

    if (error.code === "P2021" || error.code === "P2022") {
      return new InternalServerErrorException(message);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException("Invalid query or payload");
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new InternalServerErrorException("Database connection failed");
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new InternalServerErrorException("Database engine error");
  }

  return null;
}

export function handlePrismaError(error: unknown): never {
  const mapped = resolvePrismaError(error);

  if (mapped) {
    throw mapped;
  }

  throw error;
}
