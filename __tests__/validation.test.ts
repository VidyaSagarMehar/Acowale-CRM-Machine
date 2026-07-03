import { loginSchema } from "@/features/auth/schema";
import { feedbackSchema } from "@/features/feedback/schema";

// ─────────────────────────────────────────
// loginSchema
// ─────────────────────────────────────────

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "admin@acowale.local",
      password: "Admin@123"
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email address", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Admin@123"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@acowale.local",
      password: "short"
    });
    expect(result.success).toBe(false);
  });

  it("rejects when both fields are missing", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────
// feedbackSchema
// ─────────────────────────────────────────

describe("feedbackSchema", () => {
  const validPayload = {
    name: "Jane Doe",
    email: "jane@example.com",
    category: "product",
    rating: 4,
    comment: "This is a valid comment with enough length."
  };

  it("accepts a fully valid payload", () => {
    const result = feedbackSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, email: "bad-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid category value", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, category: "billing" });
    expect(result.success).toBe(false);
  });

  it("rejects a rating above 5", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, rating: 9 });
    expect(result.success).toBe(false);
  });

  it("rejects a rating below 1", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a comment shorter than 10 characters", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, comment: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a comment longer than 500 characters", () => {
    const result = feedbackSchema.safeParse({ ...validPayload, comment: "A".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("accepts all valid category values", () => {
    const categories = ["product", "support", "sales", "other"] as const;
    for (const category of categories) {
      const result = feedbackSchema.safeParse({ ...validPayload, category });
      expect(result.success).toBe(true);
    }
  });
});
