import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createE2eApp } from "../utils/app-test.util";
import { authHeader, loginAdmin } from "../utils/auth-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("CRUD Integration (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let adminToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
    ctx = await seedTestContext();
    const admin = await loginAdmin(app, ctx);
    adminToken = admin.accessToken;
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  describe("Temples", () => {
    let createdId: string;

    it("creates a temple", async () => {
      const response = await request(app.getHttpServer())
        .post("/temples")
        .set(authHeader(adminToken))
        .send({
          countryId: ctx.countryId,
          stateId: ctx.stateId,
          cityId: ctx.cityId,
          areaId: ctx.areaId,
          slug: `crud-temple-${Date.now()}`,
          name: "CRUD Temple",
        })
        .expect(201);

      createdId = response.body.data.id;
      expect(response.body.success).toBe(true);
    });

    it("reads a temple", async () => {
      await request(app.getHttpServer())
        .get(`/temples/${createdId}`)
        .set(authHeader(adminToken))
        .expect(200);
    });

    it("updates a temple", async () => {
      await request(app.getHttpServer())
        .patch(`/temples/${createdId}`)
        .set(authHeader(adminToken))
        .send({ displayName: "Updated Temple" })
        .expect(200);
    });

    it("archives a temple via status", async () => {
      await request(app.getHttpServer())
        .patch(`/temples/${createdId}/status`)
        .set(authHeader(adminToken))
        .send({ status: "ARCHIVED" })
        .expect(200);
    });

    it("restores a temple", async () => {
      await request(app.getHttpServer())
        .patch(`/temples/${createdId}/restore`)
        .set(authHeader(adminToken))
        .expect(200);
    });

    it("deletes a temple", async () => {
      await request(app.getHttpServer())
        .delete(`/temples/${createdId}`)
        .set(authHeader(adminToken))
        .expect(200);
    });

    it("validates required fields", async () => {
      await request(app.getHttpServer())
        .post("/temples")
        .set(authHeader(adminToken))
        .send({ slug: "invalid-temple" })
        .expect(400);
    });

    it("prevents duplicate slug", async () => {
      const slug = `duplicate-temple-${Date.now()}`;
      const payload = {
        countryId: ctx.countryId,
        stateId: ctx.stateId,
        cityId: ctx.cityId,
        areaId: ctx.areaId,
        slug,
        name: "Duplicate Temple",
      };

      await request(app.getHttpServer())
        .post("/temples")
        .set(authHeader(adminToken))
        .send(payload)
        .expect(201);

      await request(app.getHttpServer())
        .post("/temples")
        .set(authHeader(adminToken))
        .send(payload)
        .expect(409);
    });
  });

  describe("Festivals", () => {
    it("creates and deletes a festival", async () => {
      const slug = `crud-festival-${Date.now()}`;
      const created = await request(app.getHttpServer())
        .post("/festivals")
        .set(authHeader(adminToken))
        .send({ slug, name: "CRUD Festival" })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/festivals/${created.body.data.id}`)
        .set(authHeader(adminToken))
        .expect(200);
    });
  });

  describe("Deities", () => {
    it("creates deity with relation validation", async () => {
      await request(app.getHttpServer())
        .post("/deities")
        .set(authHeader(adminToken))
        .send({
          deityTypeId: ctx.deityTypeId,
          slug: `crud-deity-${Date.now()}`,
          name: "CRUD Deity",
        })
        .expect(201);
    });

    it("rejects invalid deity type relation", async () => {
      await request(app.getHttpServer())
        .post("/deities")
        .set(authHeader(adminToken))
        .send({
          deityTypeId: "00000000-0000-4000-8000-000000000000",
          slug: `invalid-deity-${Date.now()}`,
          name: "Invalid Deity",
        })
        .expect(404);
    });
  });

  describe("Panchangs", () => {
    it("creates and reads panchang", async () => {
      const slug = `crud-panchang-${Date.now()}`;
      const created = await request(app.getHttpServer())
        .post("/panchangs")
        .set(authHeader(adminToken))
        .send({
          panchangCode: `CP-${Date.now()}`,
          slug,
          name: "CRUD Panchang",
        })
        .expect(201);

      await request(app.getHttpServer())
        .get(`/panchangs/${created.body.data.id}`)
        .set(authHeader(adminToken))
        .expect(200);
    });
  });

  describe("Vrats", () => {
    it("creates and updates vrat", async () => {
      const slug = `crud-vrat-${Date.now()}`;
      const created = await request(app.getHttpServer())
        .post("/vrats")
        .set(authHeader(adminToken))
        .send({
          vratCode: `CV-${Date.now()}`,
          slug,
          name: "CRUD Vrat",
        })
        .expect(201);

      await request(app.getHttpServer())
        .patch(`/vrats/${created.body.data.id}`)
        .set(authHeader(adminToken))
        .send({ description: "Updated vrat" })
        .expect(200);
    });
  });

  describe("Content Items", () => {
    it("creates content item", async () => {
      await request(app.getHttpServer())
        .post("/content-items")
        .set(authHeader(adminToken))
        .send({
          contentTypeId: ctx.contentItemTypeId,
          contentCode: `CC-${Date.now()}`,
          slug: `crud-content-${Date.now()}`,
          title: "CRUD Content",
        })
        .expect(201);
    });
  });

  describe("Media Library", () => {
    it("creates media library metadata record", async () => {
      await request(app.getHttpServer())
        .post("/media-library")
        .set(authHeader(adminToken))
        .send({
          filename: "test-image.jpg",
          originalName: "test-image.jpg",
          storagePath: "temples/test-image.jpg",
          mimeType: "image/jpeg",
          mediaType: "image",
          fileSize: 1024,
        })
        .expect(201);
    });
  });
});
