import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().port().default(4000),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
  CORS_ORIGIN: Joi.string().optional(),
  CORS_CREDENTIALS: Joi.string().valid("true", "false").optional(),
  LOG_LEVEL: Joi.string().default("info"),
  SWAGGER_TITLE: Joi.string().optional(),
  SWAGGER_DESCRIPTION: Joi.string().optional(),
  SWAGGER_VERSION: Joi.string().optional(),
  SWAGGER_PATH: Joi.string().optional(),
});
