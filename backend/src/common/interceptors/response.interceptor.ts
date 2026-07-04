import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ success: boolean; message?: string; data?: T }> {
    return next.handle().pipe(
      map((data) => {
        if (
          typeof data === "object" &&
          data !== null &&
          "success" in data
        ) {
          return data as { success: boolean; message?: string; data?: T };
        }

        return {
          success: true,
          message: "Request successful",
          data,
        };
      }),
    );
  }
}
