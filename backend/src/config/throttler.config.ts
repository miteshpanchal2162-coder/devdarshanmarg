import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";

type JwtPayload = {
  role?: UserRole;
};

export function createThrottlerOptions(
  configService: ConfigService,
  jwtService: JwtService,
) {
  return {
    throttlers: [
      {
        ttl: 60_000,
        limit: (context: ExecutionContext) =>
          resolveTieredLimit(context, configService, jwtService),
      },
    ],
    skipIf: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest<{ path?: string; url?: string }>();
      const path = resolveRequestPath(request);
      return path.startsWith("/auth");
    },
  };
}

function resolveTieredLimit(
  context: ExecutionContext,
  configService: ConfigService,
  jwtService: JwtService,
): number {
  const request = context.switchToHttp().getRequest<{ headers?: Record<string, string | undefined>; path?: string; url?: string }>();
  const path = resolveRequestPath(request);

  if (path.startsWith("/health")) {
    return 30;
  }

  const role = resolveRole(request, configService, jwtService);
  if (role === UserRole.ADMIN) {
    return 500;
  }

  if (role === UserRole.USER || path.startsWith("/me")) {
    return 300;
  }

  if (path.startsWith("/public")) {
    return 100;
  }

  return role ? 300 : 100;
}

function resolveRequestPath(request: { path?: string; url?: string }) {
  const raw = request.path ?? request.url ?? "/";
  return raw.split("?")[0];
}

function resolveRole(
  request: { headers?: Record<string, string | undefined> },
  configService: ConfigService,
  jwtService: JwtService,
): UserRole | null {
  const authorization = request.headers?.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const payload = jwtService.verify<JwtPayload>(authorization.slice(7), {
      secret: configService.getOrThrow<string>("auth.jwtAccessSecret"),
    });
    return payload.role ?? null;
  } catch {
    return null;
  }
}
