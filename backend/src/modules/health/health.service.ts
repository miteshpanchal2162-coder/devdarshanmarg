import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getUploadRoot } from "../../common/storage/storage.constants";
import { PrismaService } from "../../database/prisma/prisma.service";

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    const isProduction =
      (this.configService.get<string>("app.env") ?? process.env.NODE_ENV) === "production";
    const [database, storage] = await Promise.all([
      this.checkDatabase(),
      Promise.resolve(this.checkStorage()),
    ]);

    const applicationStatus = database.status === "up" && storage.status === "up" ? "up" : "degraded";

    if (isProduction) {
      return {
        success: true,
        status: applicationStatus === "up" ? "ok" : "degraded",
        timestamp: new Date().toISOString(),
        database,
        storage: { status: storage.status },
      };
    }

    const memory = process.memoryUsage();

    return {
      success: true,
      status: applicationStatus === "up" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      application: {
        status: applicationStatus,
        environment: process.env.NODE_ENV ?? "development",
      },
      database,
      storage,
      version: this.resolveVersion(),
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
      },
    };
  }

  private async checkDatabase(): Promise<{ status: "up" | "down" }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "up" };
    } catch {
      return { status: "down" };
    }
  }

  private checkStorage(): { path: string; status: "up" | "down" } {
    try {
      const path = getUploadRoot();
      return {
        status: existsSync(path) ? "up" : "down",
        path,
      };
    } catch {
      return {
        status: "down",
        path: process.env.UPLOAD_DIR ?? process.env.UPLOAD_PATH ?? "uploads",
      };
    }
  }

  private resolveVersion(): string {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(process.cwd(), "package.json"), "utf8"),
      ) as { version?: string };
      return packageJson.version ?? "1.0.0";
    } catch {
      return process.env.npm_package_version ?? "1.0.0";
    }
  }
}
