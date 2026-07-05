import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { hashOtp } from "../../src/common/utils/otp-hash.util";
import { createE2eApp } from "../utils/app-test.util";
import { authHeader, loginAs, loginAdmin } from "../utils/auth-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("Activity Logs (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let adminToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
    ctx = await seedTestContext();
    adminToken = (await loginAdmin(app, ctx)).accessToken;
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  async function latestLog(action: string) {
    return ctx.prisma.activityLog.findFirst({
      where: { action },
      orderBy: { createdAt: "desc" },
    });
  }

  it("logs login activity", async () => {
    await loginAs(app, ctx.adminEmail, ctx.adminPassword);
    const log = await latestLog("LOGIN");
    expect(log).toBeTruthy();
  });

  it("logs logout activity", async () => {
    const tokens = await loginAs(app, ctx.userEmail, ctx.userPassword);
    await request(app.getHttpServer())
      .post("/auth/logout")
      .send({ refreshToken: tokens.refreshToken })
      .expect(201);

    const log = await latestLog("LOGOUT");
    expect(log).toBeTruthy();
  });

  it("logs create activity", async () => {
    const slug = `activity-temple-${Date.now()}`;
    await request(app.getHttpServer())
      .post("/temples")
      .set(authHeader(adminToken))
      .send({
        countryId: ctx.countryId,
        stateId: ctx.stateId,
        cityId: ctx.cityId,
        areaId: ctx.areaId,
        slug,
        name: "Activity Temple",
      })
      .expect(201);

    const log = await latestLog("CREATE");
    expect(log?.entityType).toBe("Temple");
  });

  it("logs update activity", async () => {
    await request(app.getHttpServer())
      .patch(`/temples/${ctx.templeId}`)
      .set(authHeader(adminToken))
      .send({ displayName: "Activity Updated" })
      .expect(200);

    const log = await latestLog("UPDATE");
    expect(log?.entityType).toBe("Temple");
  });

  it("logs delete activity", async () => {
    const created = await request(app.getHttpServer())
      .post("/temples")
      .set(authHeader(adminToken))
      .send({
        countryId: ctx.countryId,
        stateId: ctx.stateId,
        cityId: ctx.cityId,
        areaId: ctx.areaId,
        slug: `activity-delete-${Date.now()}`,
        name: "Delete Temple",
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/temples/${created.body.data.id}`)
      .set(authHeader(adminToken))
      .expect(200);

    const log = await latestLog("DELETE");
    expect(log?.action).toBe("DELETE");
  });

  it("logs OTP verified activity", async () => {
    await request(app.getHttpServer())
      .post("/auth/send-otp")
      .send({ mobile: ctx.userMobile, purpose: "LOGIN" })
      .expect(201);

    const otpRecord = await ctx.prisma.otpVerification.findFirst({
      where: { mobile: ctx.userMobile, purpose: "LOGIN" },
      orderBy: { createdAt: "desc" },
    });

    const plainOtp = "112233";
    await ctx.prisma.otpVerification.update({
      where: { id: otpRecord!.id },
      data: { otp: hashOtp(plainOtp) },
    });

    await request(app.getHttpServer())
      .post("/auth/verify-otp")
      .send({ mobile: ctx.userMobile, otp: plainOtp, purpose: "LOGIN" })
      .expect(201);

    const log = await latestLog("OTP VERIFIED");
    expect(log).toBeTruthy();
  });
});
