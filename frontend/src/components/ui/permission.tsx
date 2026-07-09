"use client";

import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/enterprise";
import { useAuthStore, type UserRole } from "@/stores/auth-store";
import type { ReactNode } from "react";

export type { UserRole } from "@/stores/auth-store";

type PermissionGateProps = {
  allowedRoles: readonly UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  role?: UserRole | null;
};

export function PermissionGate({
  allowedRoles,
  children,
  fallback = null,
  role,
}: PermissionGateProps) {
  const currentRole = useAuthStore((state) => state.currentRole);
  const resolvedRole = role ?? currentRole;

  if (!resolvedRole || !allowedRoles.includes(resolvedRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

type RoleGateProps = Omit<PermissionGateProps, "allowedRoles">;

export function AdminOnly(props: RoleGateProps) {
  return <PermissionGate allowedRoles={["ADMIN"]} {...props} />;
}

export function UserOnly(props: RoleGateProps) {
  return <PermissionGate allowedRoles={["USER"]} {...props} />;
}

export function RoleBadge({ role }: { role?: UserRole | null }) {
  const currentRole = useAuthStore((state) => state.currentRole);
  const resolvedRole = role ?? currentRole;

  if (!resolvedRole) {
    return (
      <Badge aria-label="Role unavailable" variant="secondary">
        Unknown
      </Badge>
    );
  }

  const config = {
    ADMIN: { label: "Admin", variant: "primary" as const },
    USER: { label: "User", variant: "secondary" as const },
  }[resolvedRole];

  return (
    <Badge aria-label={`Role: ${config.label}`} variant={config.variant}>
      {config.label}
    </Badge>
  );
}

export function AccessDenied({
  description = "You do not have permission to access this area.",
  title = "Access denied",
}: {
  description?: string;
  title?: string;
}) {
  return (
    <section aria-label={title} role="alert">
      <ErrorState description={description} title={title} />
    </section>
  );
}
