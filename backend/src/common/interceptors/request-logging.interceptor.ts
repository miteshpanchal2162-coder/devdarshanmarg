import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AuthUser } from "../interfaces/auth-user.interface";

type HttpRequest = {
  ip?: string;
  method: string;
  originalUrl?: string;
  url?: string;
  user?: AuthUser;
};

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<HttpRequest>();
    const startedAt = Date.now();
    const method = request.method?.toUpperCase() ?? "GET";
    const url = request.originalUrl ?? request.url ?? "/";
    const ip = request.ip;

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<{ statusCode?: number }>();
          this.logRequest({
            durationMs: Date.now() - startedAt,
            ip,
            method,
            status: response.statusCode ?? 200,
            url,
            userId: request.user?.id,
          });
        },
        error: (error: { status?: number }) => {
          this.logRequest({
            durationMs: Date.now() - startedAt,
            ip,
            method,
            status: error?.status ?? 500,
            url,
            userId: request.user?.id,
          });
        },
      }),
    );
  }

  private logRequest(input: {
    durationMs: number;
    ip?: string;
    method: string;
    status: number;
    url: string;
    userId?: string;
  }) {
    this.logger.log(
      JSON.stringify({
        duration: input.durationMs,
        ip: input.ip,
        method: input.method,
        status: input.status,
        url: input.url,
        userId: input.userId,
      }),
    );
  }
}
