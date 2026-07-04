import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export function ApiPaginatedResponse<TModel extends Type<unknown>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "List fetched successfully" },
          data: {
            properties: {
              items: {
                items: { $ref: getSchemaPath(model) },
                type: "array",
              },
              meta: {
                properties: {
                  page: { type: "number" },
                  limit: { type: "number" },
                  total: { type: "number" },
                  totalPages: { type: "number" },
                  hasNextPage: { type: "boolean" },
                  hasPreviousPage: { type: "boolean" },
                },
                type: "object",
              },
            },
            type: "object",
          },
        },
        type: "object",
      },
    }),
  );
}
