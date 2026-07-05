import { BadRequestException } from "@nestjs/common";
import { validateUploadedFile } from "./file-validation.util";
import { MAX_FILE_SIZE } from "./storage.constants";

describe("validateUploadedFile", () => {
  it("rejects oversize files", () => {
    expect(() =>
      validateUploadedFile(
        {
          originalname: "large.jpg",
          mimetype: "image/jpeg",
          size: MAX_FILE_SIZE + 1,
        },
        "image",
      ),
    ).toThrow(new BadRequestException("File size exceeds the 20 MB limit"));
  });

  it("rejects invalid mime types", () => {
    expect(() =>
      validateUploadedFile(
        {
          originalname: "file.txt",
          mimetype: "text/plain",
          size: 1024,
        },
        "image",
      ),
    ).toThrow(BadRequestException);
  });

  it("accepts valid image uploads", () => {
    expect(() =>
      validateUploadedFile(
        {
          originalname: "photo.png",
          mimetype: "image/png",
          size: 1024,
        },
        "image",
      ),
    ).not.toThrow();
  });
});
