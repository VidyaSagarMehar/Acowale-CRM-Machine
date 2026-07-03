import { SignJWT, jwtVerify } from "jose";

import type { AuthUser } from "@/types/auth";

const encoder = new TextEncoder();
const TOKEN_EXPIRY = "7d";

type TokenPayload = AuthUser;

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing JWT_SECRET.");
  }

  return encoder.encode(secret);
}

export async function signAuthToken(user: AuthUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<TokenPayload>(token, getSecret());

  return payload;
}
