import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ url?: string }>();
    const response = ctx.getResponse<{
      status: (statusCode: number) => { json: (body: unknown) => void };
    }>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const message =
      typeof errorResponse === "object" &&
      errorResponse !== null &&
      "message" in errorResponse
        ? (errorResponse as { message: unknown }).message
        : exception instanceof Error
          ? exception.message
          : "Internal server error";
    const error =
      typeof errorResponse === "object" &&
      errorResponse !== null &&
      "error" in errorResponse
        ? (errorResponse as { error: unknown }).error
        : exception instanceof Error
          ? exception.name
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
