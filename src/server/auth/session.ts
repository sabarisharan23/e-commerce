import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "../config/env";
import { apiErrors } from "../http/api-error";
import { getAuthUserByAuthId } from "./auth-service";

const sessionCookieName = "theni-store-session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

type SessionPayload = {
  authId: string;
  expiresAt: number;
};

function getSessionSecret() {
  return (
    process.env.AUTH_SESSION_SECRET?.trim() ||
    process.env.JWT_SECRET?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "local-development-session-secret"
  );
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function parseSessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !safeCompare(sign(encodedPayload), signature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;

    if (!payload.authId || Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(authId: string) {
  const payload: SessionPayload = {
    authId,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function setAuthSessionCookie(response: NextResponse, authId: string) {
  response.cookies.set(sessionCookieName, createSessionToken(authId), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: serverEnv.isProduction,
  });
}

export function clearAuthSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: serverEnv.isProduction,
  });
}

export function getSessionAuthId(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return parseSessionToken(token)?.authId ?? null;
}

export async function requireAuthUser(request: NextRequest) {
  const authId = getSessionAuthId(request);

  if (!authId) {
    throw apiErrors.unauthorized("Please sign in before continuing.");
  }

  const user = await getAuthUserByAuthId(authId);

  if (!user) {
    throw apiErrors.unauthorized("Please sign in before continuing.");
  }

  return user;
}
