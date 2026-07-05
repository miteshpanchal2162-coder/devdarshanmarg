import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  buildActivityDetails,
  extractEntityId,
  extractUserId,
  isMutationMethod,
  resolveActivityAction,
  resolveEntityType,
  shouldSkipActivityLogPath,
} from "../../common/utils/activity-log.util";
import { ActivityLogsService } from "./activity-logs.service";

type HttpRequest = {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  method: string;
  originalUrl?: string;
  params?: Record<string, string>;
  route?: { path?: string };
  url?: string;
  user?: AuthUser;
};

@Injectable()
export class ActivityLoggingInterceptor implements NestInterceptor {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<HttpRequest>();
    const method = request.method?.toUpperCase() ?? "GET";
    const path = this.resolvePath(request);

    if (!isMutationMethod(method) || shouldSkipActivityLogPath(path)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((response) => {
        void this.recordSafely(request, response, method, path);
      }),
    );
  }

  private async recordSafely(
    request: HttpRequest,
    response: unknown,
    method: string,
    path: string,
  ) {
    try {
      if (!this.isSuccessfulResponse(response)) {
        return;
      }

      const action = resolveActivityAction(method, path, request.body);
      if (!action) {
        return;
      }

      const params = request.params ?? {};
      const userAgentHeader = request.headers["user-agent"];
      const userAgent = typeof userAgentHeader === "string" ? userAgentHeader : undefined;

      await this.activityLogsService.recordActivity({
        userId: extractUserId(request.user?.id, response, action),
        action,
        entityType: resolveEntityType(path),
        entityId: extractEntityId(response, params),
        details: buildActivityDetails({ method, path, userAgent }),
        ipAddress: request.ip,
      });
    } catch {
      // Activity logging must never break the request pipeline.
    }
  }

  private resolvePath(request: HttpRequest) {
    if (request.route?.path) {
      return request.route.path;
    }

    return request.originalUrl ?? request.url ?? "/";
  }

  private isSuccessfulResponse(response: unknown) {
    if (!response || typeof response !== "object") {
      return true;
    }

    if ("success" in response) {
      return (response as { success?: boolean }).success !== false;
    }

    return true;
  }
}
