import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createE2eApp } from "../utils/app-test.util";
import { authHeader, loginAs, loginAdmin, loginUser } from "../utils/auth-test.util";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";
import { describeWithDb } from "../utils/db-available";

describeWithDb("Authentication (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;

  beforeAll(async () => {
    app = await createE2eApp();
    ctx = await seedTestContext();
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  it("logs in with valid credentials", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ identifier: ctx.adminEmail, password: ctx.adminPassword })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it("rejects invalid credentials", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ identifier: ctx.adminEmail, password: "WrongPassword!" })
      .expect(401);
  });

  it("refreshes access token", async () => {
    const tokens = await loginAs(app, ctx.adminEmail, ctx.adminPassword);
    const response = await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: tokens.refreshToken })
      .expect(201);

    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it("logs out with refresh token", async () => {
    const tokens = await loginAs(app, ctx.userEmail, ctx.userPassword);
    await request(app.getHttpServer())
      .post("/auth/logout")
      .send({ refreshToken: tokens.refreshToken })
      .expect(201);
  });

  it("logs out all devices for a user", async () => {
    await loginAs(app, ctx.userEmail, ctx.userPassword);
    const admin = await loginAdmin(app, ctx);

    await request(app.getHttpServer())
      .patch(`/users/${ctx.userId}/sessions/logout-all`)
      .set(authHeader(admin.accessToken))
      .expect(200);
  });

  it("rejects invalid JWT", async () => {
    await request(app.getHttpServer())
      .get("/auth/profile")
      .set(authHeader("invalid.jwt.token"))
      .expect(401);
  });

  it("rejects expired JWT", async () => {
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    await request(app.getHttpServer())
      .get("/auth/profile")
      .set(authHeader(expiredToken))
      .expect(401);
  });

  it("rejects invalid refresh token", async () => {
    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: "not-a-valid-token" })
      .expect(401);
  });

  it("rejects revoked refresh token", async () => {
    const tokens = await loginUser(app, ctx);
    await request(app.getHttpServer())
      .post("/auth/logout")
      .send({ refreshToken: tokens.refreshToken })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: tokens.refreshToken })
      .expect(401);
  });
});
