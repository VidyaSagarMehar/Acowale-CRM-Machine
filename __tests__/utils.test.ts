import { formatCategoryLabel, formatDate } from "@/lib/utils";

describe("formatCategoryLabel", () => {
  it("capitalises a single-word category", () => {
    expect(formatCategoryLabel("product")).toBe("Product");
  });

  it("capitalises each word in a hyphenated category", () => {
    expect(formatCategoryLabel("customer-support")).toBe("Customer Support");
  });

  it("handles a three-part hyphenated string", () => {
    expect(formatCategoryLabel("one-two-three")).toBe("One Two Three");
  });

  it("returns an empty string when given an empty string", () => {
    expect(formatCategoryLabel("")).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date string without throwing", () => {
    const result = formatDate("2024-01-15T10:30:00.000Z");
    // The output is locale-specific, so we verify it is a non-empty string
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats a Date object without throwing", () => {
    const result = formatDate(new Date("2024-06-01T00:00:00.000Z"));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
