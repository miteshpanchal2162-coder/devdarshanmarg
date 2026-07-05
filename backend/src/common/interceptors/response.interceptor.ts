import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { serializeValue } from "../utils/serialization.util";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ success: boolean; message?: string; data?: T }> {
    return next.handle().pipe(
      map((data) => {
        const serialized = serializeValue(data) as T;

        if (
          typeof serialized === "object" &&
          serialized !== null &&
          "success" in serialized
        ) {
          return serialized as { success: boolean; message?: string; data?: T };
        }

        return {
          success: true,
          message: "Request successful",
          data: serialized,
        };
      }),
    );
  }
}
