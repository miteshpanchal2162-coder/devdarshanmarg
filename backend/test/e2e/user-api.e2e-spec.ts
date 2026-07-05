import { INestApplication } from "@nestjs/common";
import { UserEntityType } from "@prisma/client";
import request from "supertest";
import { createE2eApp } from "../utils/app-test.util";
import { authHeader, loginOtherUser, loginUser } from "../utils/auth-test.util";
import { describeWithDb } from "../utils/db-available";
import { cleanupTestContext, disconnectTestPrisma, seedTestContext, TestContext } from "../utils/factories";

describeWithDb("User API (e2e)", () => {
  let app: INestApplication;
  let ctx: TestContext;
  let userToken: string;
  let otherToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
    ctx = await seedTestContext();
    userToken = (await loginUser(app, ctx)).accessToken;
    otherToken = (await loginOtherUser(app, ctx)).accessToken;
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
    await app.close();
    await disconnectTestPrisma();
  });

  it("gets current user profile at /me", async () => {
    const response = await request(app.getHttpServer())
      .get("/me")
      .set(authHeader(userToken))
      .expect(200);

    expect(response.body.data.userId).toBe(ctx.userId);
  });

  it("updates profile at /me", async () => {
    await request(app.getHttpServer())
      .patch("/me")
      .set(authHeader(userToken))
      .send({ bio: "Updated bio" })
      .expect(200);
  });

  it("manages favorites", async () => {
    const created = await request(app.getHttpServer())
      .post("/me/favorites")
      .set(authHeader(userToken))
      .send({ entityType: UserEntityType.TEMPLE, entityId: ctx.templeId })
      .expect(201);

    await request(app.getHttpServer()).get("/me/favorites").set(authHeader(userToken)).expect(200);

    await request(app.getHttpServer())
      .delete(`/me/favorites/${created.body.data.id}`)
      .set(authHeader(userToken))
      .expect(200);
  });

  it("manages ratings", async () => {
    const created = await request(app.getHttpServer())
      .post("/me/ratings")
      .set(authHeader(userToken))
      .send({ entityType: UserEntityType.TEMPLE, entityId: ctx.templeId, rating: 5 })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/me/ratings/${created.body.data.id}`)
      .set(authHeader(userToken))
      .send({ rating: 4 })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/me/ratings/${created.body.data.id}`)
      .set(authHeader(userToken))
      .expect(200);
  });

  it("manages reviews", async () => {
    const created = await request(app.getHttpServer())
      .post("/me/reviews")
      .set(authHeader(userToken))
      .send({
        entityType: UserEntityType.TEMPLE,
        entityId: ctx.templeId,
        review: "Great temple",
        rating: 5,
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/me/reviews/${created.body.data.id}`)
      .set(authHeader(userToken))
      .send({ review: "Updated review" })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/me/reviews/${created.body.data.id}`)
      .set(authHeader(userToken))
      .expect(200);
  });

  it("manages comments", async () => {
    const created = await request(app.getHttpServer())
      .post("/me/comments")
      .set(authHeader(userToken))
      .send({
        entityType: UserEntityType.TEMPLE,
        entityId: ctx.templeId,
        comment: "Nice place",
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/me/comments/${created.body.data.id}`)
      .set(authHeader(userToken))
      .expect(200);
  });

  it("enforces ownership on update", async () => {
    const created = await request(app.getHttpServer())
      .post("/me/reviews")
      .set(authHeader(userToken))
      .send({
        entityType: UserEntityType.TEMPLE,
        entityId: ctx.templeId,
        review: "Owner only",
        rating: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/me/reviews/${created.body.data.id}`)
      .set(authHeader(otherToken))
      .send({ review: "Hacked" })
      .expect(403);

    await request(app.getHttpServer())
      .delete(`/me/reviews/${created.body.data.id}`)
      .set(authHeader(userToken))
      .expect(200);
  });

  it("rejects unauthenticated access", async () => {
    await request(app.getHttpServer()).get("/me").expect(401);
  });
});
