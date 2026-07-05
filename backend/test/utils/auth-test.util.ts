import { INestApplication } from "@nestjs/common";
import request from "supertest";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
};

export async function loginAs(
  app: INestApplication,
  identifier: string,
  password: string,
): Promise<AuthTokens> {
  const response = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ identifier, password })
    .expect(201);

  return {
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
    sessionId: response.body.data.sessionId,
  };
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function loginAdmin(app: INestApplication, context: { adminEmail: string; adminPassword: string }) {
  return loginAs(app, context.adminEmail, context.adminPassword);
}

export async function loginUser(app: INestApplication, context: { userEmail: string; userPassword: string }) {
  return loginAs(app, context.userEmail, context.userPassword);
}

export async function loginOtherUser(
  app: INestApplication,
  context: { otherUserEmail: string; otherUserPassword: string },
) {
  return loginAs(app, context.otherUserEmail, context.otherUserPassword);
}
