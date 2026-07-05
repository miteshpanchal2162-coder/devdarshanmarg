import { Injectable, OnModuleInit } from "@nestjs/common";
import { existsSync, unlinkSync } from "fs";
import {
  StorageFolder,
  buildRelativeStoragePath,
  ensureUploadDirectories,
  getUploadRoot,
  resolveAbsolutePath,
  resolveStorageFolder,
} from "./storage.constants";

@Injectable()
export class StorageService implements OnModuleInit {
  onModuleInit() {
    ensureUploadDirectories();
  }

  resolveFolderFromRequest(request: {
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
  }): StorageFolder {
    return resolveStorageFolder(request);
  }

  getUploadRootPath(): string {
    return getUploadRoot();
  }

  buildRelativePath(folder: StorageFolder, filename: string): string {
    return buildRelativeStoragePath(folder, filename);
  }

  getAbsolutePath(relativePath: string): string {
    return resolveAbsolutePath(relativePath);
  }

  deletePhysicalFile(relativePath: string): void {
    const absolutePath = this.getAbsolutePath(relativePath);

    if (existsSync(absolutePath)) {
      unlinkSync(absolutePath);
    }
  }

  deleteUploadedFileIfExists(relativePath: string): void {
    this.deletePhysicalFile(relativePath);
  }
}
