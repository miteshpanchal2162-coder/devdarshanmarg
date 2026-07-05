import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testMatch: ["<rootDir>/test/**/*.spec.ts", "<rootDir>/src/common/**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.(t|j)s",
    "!src/main.ts",
    "!src/**/*.module.ts",
    "!src/**/dto/**",
    "!src/**/strategies/**",
    "!src/**/*.spec.ts",
    "!src/config/**",
    "!src/database/**",
    "!src/common/storage/multer.config.ts",
    "!src/common/storage/storage.service.ts",
    "!src/modules/health/**",
  ],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/src/modules"],
  testPathIgnorePatterns: ["<rootDir>/src/modules"],
  maxWorkers: "50%",
};

export default config;
