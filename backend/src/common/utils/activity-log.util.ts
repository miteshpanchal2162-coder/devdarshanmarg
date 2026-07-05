const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isMutationMethod(method: string) {
  return MUTATION_METHODS.has(method.toUpperCase());
}

export function shouldSkipActivityLogPath(path: string) {
  const normalized = path.split("?")[0].toLowerCase();

  if (normalized === "/health") return true;
  if (normalized.startsWith("/docs")) return true;
  if (normalized.startsWith("/uploads")) return true;
  if (normalized.startsWith("/public")) return true;
  if (normalized.startsWith("/activity-logs")) return true;

  return false;
}

export function resolveActivityAction(
  method: string,
  path: string,
  body: unknown,
): string | null {
  const normalizedMethod = method.toUpperCase();
  const normalizedPath = path.split("?")[0].toLowerCase();

  if (normalizedPath === "/auth/login" && normalizedMethod === "POST") {
    return "LOGIN";
  }

  if (normalizedPath === "/auth/logout" && normalizedMethod === "POST") {
    return "LOGOUT";
  }

  if (normalizedPath === "/auth/refresh" && normalizedMethod === "POST") {
    return "REFRESH TOKEN";
  }

  if (normalizedPath === "/auth/verify-otp" && normalizedMethod === "POST") {
    return "OTP VERIFIED";
  }

  if (/\/otp-verifications\/[^/]+\/verify$/.test(normalizedPath) && normalizedMethod === "PATCH") {
    return "OTP VERIFIED";
  }

  if (/\/restore$/.test(normalizedPath) && normalizedMethod === "PATCH") {
    return "RESTORE";
  }

  if (/\/status$/.test(normalizedPath) && normalizedMethod === "PATCH") {
    if (hasArchivedStatus(body)) {
      return "ARCHIVE";
    }
    return "UPDATE";
  }

  if (
    (normalizedMethod === "PATCH" || normalizedMethod === "PUT") &&
    hasPasswordField(body)
  ) {
    return "PASSWORD CHANGE";
  }

  if (normalizedMethod === "DELETE") {
    return "DELETE";
  }

  if (normalizedMethod === "PATCH" || normalizedMethod === "PUT") {
    return "UPDATE";
  }

  if (normalizedMethod === "POST") {
    return "CREATE";
  }

  return null;
}

export function resolveEntityType(path: string): string {
  const segments = path
    .split("?")[0]
    .split("/")
    .filter(Boolean)
    .filter((segment) => !segment.startsWith(":") && !isUuid(segment));

  if (segments.length === 0) {
    return "System";
  }

  if (segments[0] === "auth") {
    return "Auth";
  }

  if (segments[0] === "me") {
    return segments.length > 1 ? toEntityType(segments[1]) : "User";
  }

  const actionSuffixes = new Set(["restore", "status", "verify", "retry"]);
  let resourceSegment = segments[segments.length - 1] ?? segments[0];

  if (actionSuffixes.has(resourceSegment) && segments.length > 1) {
    resourceSegment = segments[segments.length - 2];
  }

  return toEntityType(resourceSegment);
}

export function extractEntityId(
  response: unknown,
  params: Record<string, string>,
): string | undefined {
  const payload = unwrapResponseData(response);

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (typeof record.id === "string" && isUuid(record.id)) {
      return record.id;
    }

    if (record.user && typeof record.user === "object") {
      const user = record.user as Record<string, unknown>;
      if (typeof user.id === "string" && isUuid(user.id)) {
        return user.id;
      }
    }

    if (record.sessionId && typeof record.sessionId === "string" && isUuid(record.sessionId)) {
      return record.sessionId;
    }
  }

  if (params.id && isUuid(params.id)) {
    return params.id;
  }

  const paramIds = Object.values(params).filter((value) => isUuid(value));
  return paramIds[paramIds.length - 1];
}

export function extractUserId(
  requestUserId: string | undefined,
  response: unknown,
  action: string,
): string | undefined {
  if (requestUserId) {
    return requestUserId;
  }

  if (action === "LOGIN" || action === "REFRESH TOKEN") {
    const payload = unwrapResponseData(response);
    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>;
      if (record.user && typeof record.user === "object") {
        const user = record.user as Record<string, unknown>;
        if (typeof user.id === "string") {
          return user.id;
        }
      }
    }
  }

  return undefined;
}

export function buildActivityDetails(input: {
  method: string;
  path: string;
  userAgent?: string;
}) {
  return {
    method: input.method,
    path: input.path,
    ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    timestamp: new Date().toISOString(),
  };
}

function unwrapResponseData(response: unknown): unknown {
  if (!response || typeof response !== "object") {
    return response;
  }

  const envelope = response as Record<string, unknown>;
  if ("data" in envelope) {
    return envelope.data;
  }

  return response;
}

function hasPasswordField(body: unknown) {
  return (
    body !== null &&
    typeof body === "object" &&
    "password" in body &&
    Boolean((body as Record<string, unknown>).password)
  );
}

function hasArchivedStatus(body: unknown) {
  return (
    body !== null &&
    typeof body === "object" &&
    "status" in body &&
    String((body as Record<string, unknown>).status).toUpperCase() === "ARCHIVED"
  );
}

function toEntityType(segment: string) {
  const normalized = segment.endsWith("ies")
    ? `${segment.slice(0, -3)}y`
    : segment.endsWith("s")
      ? segment.slice(0, -1)
      : segment;

  return normalized
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}
