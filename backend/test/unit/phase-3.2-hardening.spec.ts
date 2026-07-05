// @ts-nocheck
import { NotFoundException } from "@nestjs/common";
import { extractStoragePath } from "../../src/modules/public/media/public-media-visibility.service";
import { mapPublicMedia } from "../../src/modules/public/common/public-media.mapper";
import { createThrottlerOptions } from "../../src/config/throttler.config";

describe("phase 3.2 hardening", () => {
  describe("extractStoragePath", () => {
    it("extracts normalized storage paths and rejects traversal", () => {
      expect(extractStoragePath("/uploads/temples/photo.jpg")).toBe("temples/photo.jpg");
      expect(extractStoragePath("uploads/festivals/banner.png")).toBe("festivals/banner.png");
      expect(extractStoragePath("contents/doc.pdf")).toBe("contents/doc.pdf");
      expect(extractStoragePath("../temples/photo.jpg")).toBeNull();
      expect(extractStoragePath("temples/a/b.jpg")).toBeNull();
    });
  });

  describe("mapPublicMedia", () => {
    it("maps media without filesystem paths", () => {
      const mapped = mapPublicMedia({
        id: "media-1",
        filename: "photo.jpg",
        originalName: "Photo.jpg",
        mimeType: "image/jpeg",
        mediaType: "image",
        storagePath: "temples/photo.jpg",
        storageType: "local",
        fileSize: 100,
        width: 100,
        height: 100,
        altText: "Alt",
        uploadedById: "user-1",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      });

      expect(mapped).toEqual({
        id: "media-1",
        url: "/public/media/media-1/file",
        filename: "photo.jpg",
        originalName: "Photo.jpg",
        mimeType: "image/jpeg",
        extension: "jpg",
        size: 100,
        width: 100,
        height: 100,
        alt: "Alt",
        title: "Photo.jpg",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      });
      expect(mapped).not.toHaveProperty("storagePath");
    });
  });

  describe("createThrottlerOptions", () => {
    it("skips auth routes and applies tiered limits", () => {
      const configService = {
        getOrThrow: jest.fn().mockReturnValue("secret"),
      };
      const jwtService = {
        verify: jest.fn().mockReturnValue({ role: "ADMIN" }),
      };
      const options = createThrottlerOptions(configService as never, jwtService as never);
      const adminContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            path: "/temples",
            headers: { authorization: "Bearer token" },
          }),
        }),
      };

      expect(options.skipIf({ switchToHttp: () => ({ getRequest: () => ({ path: "/auth/login" }) }) } as never)).toBe(true);
      expect(options.throttlers[0].limit(adminContext as never)).toBe(500);
    });
  });
});
