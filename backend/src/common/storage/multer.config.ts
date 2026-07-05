import { randomUUID } from "crypto";
import { join } from "path";
import { diskStorage } from "multer";
import {
  MAX_FILE_SIZE,
  ensureDirectory,
  getUploadRoot,
  normalizeExtension,
  resolveStorageFolder,
} from "./storage.constants";

export function createMulterOptions() {
  return {
    storage: diskStorage({
      destination: (request, _file, callback) => {
        try {
          const folder = resolveStorageFolder(request);
          const destination = ensureDirectory(join(getUploadRoot(), folder));
          callback(null, destination);
        } catch (error) {
          callback(error as Error, "");
        }
      },
      filename: (_request, file, callback) => {
        callback(null, `${randomUUID()}${normalizeExtension(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  };
}
