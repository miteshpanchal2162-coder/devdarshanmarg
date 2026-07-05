import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { resolvePrismaError } from "../exceptions/prisma-error.handler";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const mappedException = resolvePrismaError(exception) ?? exception;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ url?: string }>();
    const response = ctx.getResponse<{
      status: (statusCode: number) => { json: (body: unknown) => void };
    }>();
    const status =
      mappedException instanceof HttpException
        ? mappedException.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse =
      mappedException instanceof HttpException ? mappedException.getResponse() : undefined;
    const message =
      typeof errorResponse === "object" &&
      errorResponse !== null &&
      "message" in errorResponse
        ? (errorResponse as { message: unknown }).message
        : mappedException instanceof Error
          ? mappedException.message
          : "Internal server error";
    const error =
      typeof errorResponse === "object" &&
      errorResponse !== null &&
      "error" in errorResponse
        ? (errorResponse as { error: unknown }).error
        : mappedException instanceof Error
          ? mappedException.name
          : "InternalServerError";

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url ?? "",
    });
  }
}
