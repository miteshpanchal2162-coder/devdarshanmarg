import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createE2eApp } from "../utils/app-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("Public API (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let templeSlug: string;
  let festivalSlug: string;
  let deitySlug: string;
  let panchangSlug: string;
  let contentSlug: string;

  beforeAll(async () => {
    app = await createE2eApp();
    ctx = await seedTestContext();

    const temple = await ctx.prisma.temple.findUnique({ where: { id: ctx.templeId } });
    const festival = await ctx.prisma.festival.findUnique({ where: { id: ctx.festivalId } });
    const deity = await ctx.prisma.deity.findUnique({ where: { id: ctx.deityId } });
    const panchang = await ctx.prisma.panchang.findUnique({ where: { id: ctx.panchangId } });
    const content = await ctx.prisma.contentItem.findUnique({ where: { id: ctx.contentItemId } });

    templeSlug = temple!.slug;
    festivalSlug = festival!.slug;
    deitySlug = deity!.slug;
    panchangSlug = panchang!.slug;
    contentSlug = content!.slug;
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  it("lists public temples with pagination", async () => {
    const response = await request(app.getHttpServer()).get("/public/temples?page=1&limit=5").expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
    expect(response.body.data.meta).toBeDefined();
  });

  it("searches public temples", async () => {
    await request(app.getHttpServer()).get("/public/temples?search=Test").expect(200);
  });

  it("gets public temple by slug", async () => {
    const response = await request(app.getHttpServer()).get(`/public/temples/${templeSlug}`).expect(200);

    expect(response.body.data.slug).toBe(templeSlug);
    expect(response.body.data).not.toHaveProperty("createdBy");
  });

  it("lists public festivals", async () => {
    await request(app.getHttpServer()).get("/public/festivals").expect(200);
  });

  it("gets public festival by slug", async () => {
    await request(app.getHttpServer()).get(`/public/festivals/${festivalSlug}`).expect(200);
  });

  it("lists public deities", async () => {
    await request(app.getHttpServer()).get("/public/deities").expect(200);
  });

  it("gets public deity by slug", async () => {
    await request(app.getHttpServer()).get(`/public/deities/${deitySlug}`).expect(200);
  });

  it("lists public panchang", async () => {
    await request(app.getHttpServer()).get("/public/panchang").expect(200);
  });

  it("gets public panchang by slug", async () => {
    await request(app.getHttpServer()).get(`/public/panchang/${panchangSlug}`).expect(200);
  });

  it("lists published public content", async () => {
    const response = await request(app.getHttpServer()).get("/public/content").expect(200);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });

  it("gets public content by slug", async () => {
    await request(app.getHttpServer()).get(`/public/content/${contentSlug}`).expect(200);
  });

  it("hides archived content from public API", async () => {
    await ctx.prisma.contentItem.update({
      where: { id: ctx.contentItemId },
      data: { status: "ARCHIVED" },
    });

    await request(app.getHttpServer()).get(`/public/content/${contentSlug}`).expect(404);

    await ctx.prisma.contentItem.update({
      where: { id: ctx.contentItemId },
      data: { status: "ACTIVE" },
    });
  });

  it("does not require authentication", async () => {
    await request(app.getHttpServer()).get("/public/temples").expect(200);
  });
});
