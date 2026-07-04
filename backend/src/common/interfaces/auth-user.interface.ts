import { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
}
