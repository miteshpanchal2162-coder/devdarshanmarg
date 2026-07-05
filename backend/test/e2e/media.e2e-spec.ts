import { INestApplication } from "@nestjs/common";
import { existsSync, mkdirSync, rmSync } from "fs";
import { resolve } from "path";
import request from "supertest";
import { createE2eApp } from "../utils/app-test.util";
import { authHeader, loginAdmin } from "../utils/auth-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("Media Upload (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let adminToken: string;
  let uploadRoot: string;

  beforeAll(async () => {
    uploadRoot = resolve(process.cwd(), "test-uploads");
    if (!existsSync(uploadRoot)) {
      mkdirSync(uploadRoot, { recursive: true });
    }

    app = await createE2eApp();
    ctx = await seedTestContext();
    adminToken = (await loginAdmin(app, ctx)).accessToken;
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();

    if (existsSync(uploadRoot)) {
      rmSync(uploadRoot, { recursive: true, force: true });
    }
  });

  it("uploads a valid image", async () => {
    const response = await request(app.getHttpServer())
      .post("/media-library/upload/image")
      .set(authHeader(adminToken))
      .field("folder", "temp")
      .attach("file", Buffer.from("fake-image"), {
        filename: "sample.png",
        contentType: "image/png",
      })
      .expect(201);

    expect(response.body.data.fileName).toContain("sample");
  });

  it("rejects invalid MIME type", async () => {
    await request(app.getHttpServer())
      .post("/media-library/upload/image")
      .set(authHeader(adminToken))
      .field("folder", "temp")
      .attach("file", Buffer.from("not-an-image"), {
        filename: "sample.txt",
        contentType: "text/plain",
      })
      .expect(400);
  });

  it("rejects invalid extension", async () => {
    await request(app.getHttpServer())
      .post("/media-library/upload/image")
      .set(authHeader(adminToken))
      .field("folder", "temp")
      .attach("file", Buffer.from("fake"), {
        filename: "sample.exe",
        contentType: "image/png",
      })
      .expect(400);
  });

  it("rejects invalid storage folder", async () => {
    await request(app.getHttpServer())
      .post("/media-library/upload/image")
      .set(authHeader(adminToken))
      .field("folder", "../etc")
      .attach("file", Buffer.from("fake-image"), {
        filename: "sample.png",
        contentType: "image/png",
      })
      .expect(400);
  });
});
