import { BadRequestException } from "@nestjs/common";
import { resolveStorageFolder, sanitizeRelativeStoragePath } from "./storage.constants";

describe("storage.constants", () => {
  it("sanitizeRelativeStoragePath rejects path traversal", () => {
    expect(() => sanitizeRelativeStoragePath("../users/secret.png")).toThrow(
      new BadRequestException("Invalid storage path"),
    );
  });

  it("resolveStorageFolder rejects invalid folder", () => {
    expect(() =>
      resolveStorageFolder({
        body: { folder: "invalid-folder" },
      }),
    ).toThrow(BadRequestException);
  });
});
