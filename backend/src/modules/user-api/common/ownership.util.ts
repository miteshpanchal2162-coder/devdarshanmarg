import { ForbiddenException, NotFoundException } from "@nestjs/common";

export function assertResourceOwnership(
  record: { userId: string } | null,
  userId: string,
  resourceName = "Resource",
) {
  if (!record) {
    throw new NotFoundException(`${resourceName} not found`);
  }

  if (record.userId !== userId) {
    throw new ForbiddenException("You do not have access to this resource");
  }
}
