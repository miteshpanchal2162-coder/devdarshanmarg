import { prisma } from "../lib/prisma";

import { Prisma } from "@prisma/client";

interface LogActivityInput {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
}

/** Log admin activity for audit trail */
export async function logActivity(input: LogActivityInput) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        details: input.details,
        ipAddress: input.ipAddress,
      },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
