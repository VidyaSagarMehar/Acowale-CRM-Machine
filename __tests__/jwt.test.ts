/**
 * @jest-environment node
 *
 * Tests for lib/jwt.ts
 *
 * signAuthToken and verifyAuthToken rely on process.env.JWT_SECRET.
 * We set a test secret in beforeAll and restore it in afterAll.
 *
 * These tests use the real `jose` library without mocking because
 * the logic under test IS the cryptographic round-trip.
 *
 * This file runs in the Node environment (not jsdom) because jose's
 * Node CJS build requires TextEncoder and the Web Crypto API, both of
 * which are available natively in Node 18+ but not in jsdom.
 */

import { signAuthToken, verifyAuthToken } from "@/lib/jwt";
import type { AuthUser } from "@/types/auth";

const TEST_SECRET = "test-secret-that-is-at-least-32-chars-long";

const testUser: AuthUser = {
  id: "507f1f77bcf86cd799439011",
  email: "admin@acowale.local",
  role: "admin"
};

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

afterAll(() => {
  delete process.env.JWT_SECRET;
});

describe("signAuthToken", () => {
  it("returns a non-empty JWT string", async () => {
    const token = await signAuthToken(testUser);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("produces a token with three dot-separated segments (header.payload.signature)", async () => {
    const token = await signAuthToken(testUser);
    const parts = token.split(".");
    expect(parts).toHaveLength(3);
  });
});

describe("verifyAuthToken", () => {
  it("verifies a token signed with the same secret", async () => {
    const token = await signAuthToken(testUser);
    const payload = await verifyAuthToken(token);
    expect(payload.email).toBe(testUser.email);
    expect(payload.role).toBe(testUser.role);
  });

  it("throws when the token is tampered with", async () => {
    const token = await signAuthToken(testUser);
    const tampered = token.slice(0, -5) + "XXXXX";
    await expect(verifyAuthToken(tampered)).rejects.toThrow();
  });

  it("throws when JWT_SECRET is missing", async () => {
    const token = await signAuthToken(testUser);
    delete process.env.JWT_SECRET;
    await expect(verifyAuthToken(token)).rejects.toThrow("Missing JWT_SECRET.");
    // Restore for subsequent tests
    process.env.JWT_SECRET = TEST_SECRET;
  });
});
