import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createE2eApp } from "../utils/app-test.util";
import { authHeader, loginAdmin, loginUser } from "../utils/auth-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("Security (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
    ctx = await seedTestContext();
    adminToken = (await loginAdmin(app, ctx)).accessToken;
    userToken = (await loginUser(app, ctx)).accessToken;
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  it("requires authentication for admin routes", async () => {
    await request(app.getHttpServer()).get("/temples").expect(401);
  });

  it("enforces admin RBAC on temple management", async () => {
    await request(app.getHttpServer())
      .get("/temples")
      .set(authHeader(userToken))
      .expect(403);
  });

  it("allows admin access to protected routes", async () => {
    await request(app.getHttpServer()).get("/temples").set(authHeader(adminToken)).expect(200);
  });

  it("rejects forbidden user access to OTP admin CRUD", async () => {
    await request(app.getHttpServer()).get("/otp-verifications").set(authHeader(userToken)).expect(403);
  });

  it("rejects path traversal in storage path helper via upload metadata", async () => {
    await request(app.getHttpServer())
      .post("/media-library")
      .set(authHeader(adminToken))
      .send({
        filename: "bad.jpg",
        originalName: "bad.jpg",
        storagePath: "../secrets/bad.jpg",
        mimeType: "image/jpeg",
        mediaType: "image",
        fileSize: 100,
      })
      .expect(400);
  });
});
