import { formatCategoryLabel } from "@/lib/utils";

describe("formatCategoryLabel", () => {
  it("formats dashed category names for display", () => {
    expect(formatCategoryLabel("product")).toBe("Product");
    expect(formatCategoryLabel("customer-support")).toBe("Customer Support");
  });
});
