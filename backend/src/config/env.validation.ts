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
  CORS_ORIGIN: Joi.when("NODE_ENV", {
    is: "production",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  CORS_CREDENTIALS: Joi.string().valid("true", "false").optional(),
  UPLOAD_DIR: Joi.string().optional(),
  UPLOAD_PATH: Joi.string().optional(),
  LOG_LEVEL: Joi.string().default("info"),
  SWAGGER_TITLE: Joi.string().optional(),
  SWAGGER_DESCRIPTION: Joi.string().optional(),
  SWAGGER_VERSION: Joi.string().optional(),
  SWAGGER_PATH: Joi.string().optional(),
  SWAGGER_ENABLED: Joi.string().valid("true", "false").optional(),
  OTP_EXPIRES_IN: Joi.string().default("5m"),
  OTP_MAX_RETRIES: Joi.number().integer().min(1).default(5),
  OTP_VERIFICATION_TOKEN_EXPIRES_IN: Joi.string().default("10m"),
}).custom((value, helpers) => {
  if (value.NODE_ENV === "production" && !value.UPLOAD_DIR && !value.UPLOAD_PATH) {
    return helpers.error("any.custom", {
      message: "UPLOAD_DIR or UPLOAD_PATH is required in production",
    });
  }

  return value;
});
