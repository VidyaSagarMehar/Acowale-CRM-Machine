import { loginSchema } from "@/features/auth/schema";
import { feedbackSchema } from "@/features/feedback/schema";

describe("validation schemas", () => {
  it("accepts valid login payloads", () => {
    const result = loginSchema.safeParse({
      email: "admin@acowale.local",
      password: "Admin@123"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid feedback payloads", () => {
    const result = feedbackSchema.safeParse({
      name: "A",
      email: "wrong",
      category: "product",
      rating: 9,
      comment: "short"
    });

    expect(result.success).toBe(false);
  });
});
