import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { hashOtp } from "../../src/common/utils/otp-hash.util";
import { createE2eApp } from "../utils/app-test.util";
import { loginAs } from "../utils/auth-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("OTP Authentication (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let jwtService: JwtService;

  beforeAll(async () => {
    app = await createE2eApp();
    jwtService = app.get(JwtService);
    ctx = await seedTestContext();
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  it("sends OTP for login purpose", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/send-otp")
      .send({ mobile: ctx.userMobile, purpose: "LOGIN" })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.expireTime).toBeDefined();
    expect(response.body.data).not.toHaveProperty("otp");
  });

  it("verifies OTP and returns verification token", async () => {
    await request(app.getHttpServer())
      .post("/auth/send-otp")
      .send({ mobile: ctx.userMobile, purpose: "LOGIN" })
      .expect(201);

    const otpRecord = await ctx.prisma.otpVerification.findFirst({
      where: { mobile: ctx.userMobile, purpose: "LOGIN" },
      orderBy: { createdAt: "desc" },
    });

    const plainOtp = "654321";
    await ctx.prisma.otpVerification.update({
      where: { id: otpRecord!.id },
      data: { otp: hashOtp(plainOtp) },
    });

    const response = await request(app.getHttpServer())
      .post("/auth/verify-otp")
      .send({ mobile: ctx.userMobile, otp: plainOtp, purpose: "LOGIN" })
      .expect(201);

    expect(response.body.data.verificationToken).toBeDefined();
    const payload = await jwtService.verifyAsync(response.body.data.verificationToken, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    expect(payload.type).toBe("otp_verification");
  });

  it("rejects wrong OTP", async () => {
    await request(app.getHttpServer())
      .post("/auth/send-otp")
      .send({ mobile: ctx.userMobile, purpose: "LOGIN" })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/verify-otp")
      .send({ mobile: ctx.userMobile, otp: "000000", purpose: "LOGIN" })
      .expect(401);
  });

  it("rejects expired OTP", async () => {
    await ctx.prisma.otpVerification.create({
      data: {
        mobile: ctx.userMobile,
        otp: hashOtp("111111"),
        purpose: "LOGIN",
        expireTime: new Date(Date.now() - 60_000),
      },
    });

    await request(app.getHttpServer())
      .post("/auth/verify-otp")
      .send({ mobile: ctx.userMobile, otp: "111111", purpose: "LOGIN" })
      .expect(400);
  });

  it("handles forgot password without leaking user existence", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/forgot-password")
      .send({ mobile: ctx.userMobile })
      .expect(201);

    expect(response.body.message).toContain("If the mobile number is registered");
  });

  it("resets password with verification token", async () => {
    await request(app.getHttpServer())
      .post("/auth/forgot-password")
      .send({ mobile: ctx.userMobile })
      .expect(201);

    const otpRecord = await ctx.prisma.otpVerification.findFirst({
      where: { mobile: ctx.userMobile, purpose: "RESET_PASSWORD" },
      orderBy: { createdAt: "desc" },
    });

    const plainOtp = "987654";
    await ctx.prisma.otpVerification.update({
      where: { id: otpRecord!.id },
      data: { otp: hashOtp(plainOtp) },
    });

    const verifyResponse = await request(app.getHttpServer())
      .post("/auth/verify-otp")
      .send({ mobile: ctx.userMobile, otp: plainOtp, purpose: "RESET_PASSWORD" })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/reset-password")
      .send({
        verificationToken: verifyResponse.body.data.verificationToken,
        newPassword: "NewPassword123!",
      })
      .expect(201);

    await loginAs(app, ctx.userEmail, "NewPassword123!");
  });

  it("applies throttling on send-otp", async () => {
    const mobile = `+91999${Date.now().toString().slice(-7)}`;
    let throttled = false;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const response = await request(app.getHttpServer())
        .post("/auth/send-otp")
        .send({ mobile, purpose: "REGISTER" });

      if (response.status === 429) {
        throttled = true;
        break;
      }
    }

    expect(throttled).toBe(true);
  });
});
