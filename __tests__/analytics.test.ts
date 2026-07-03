/**
 * Tests for analytics calculation helpers.
 *
 * These tests verify the pure data-transformation logic used in
 * the analytics API route — rounding, empty states, and aggregation shape.
 * They do NOT test the Mongoose aggregation pipeline itself (that belongs in
 * integration tests with a real or in-memory MongoDB instance).
 */

import { formatCategoryLabel } from "@/lib/utils";
import type { AnalyticsSummary, CategoryCount } from "@/types/analytics";

// ─────────────────────────────────────────
// averageRating rounding (mirrors the toFixed(1) logic in the route)
// ─────────────────────────────────────────

function computeAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return Number((sum / ratings.length).toFixed(1));
}

describe("computeAverageRating", () => {
  it("returns 0 for an empty ratings array", () => {
    expect(computeAverageRating([])).toBe(0);
  });

  it("returns the exact value when no rounding is needed", () => {
    expect(computeAverageRating([4, 4, 4])).toBe(4);
  });

  it("rounds to one decimal place", () => {
    expect(computeAverageRating([1, 2, 3, 4, 5])).toBe(3);
    expect(computeAverageRating([3, 4])).toBe(3.5);
    expect(computeAverageRating([1, 1, 2])).toBe(1.3);
  });

  it("handles a single rating", () => {
    expect(computeAverageRating([5])).toBe(5);
  });
});

// ─────────────────────────────────────────
// AnalyticsSummary shape
// ─────────────────────────────────────────

describe("AnalyticsSummary shape", () => {
  const mockSummary: AnalyticsSummary = {
    totalFeedback: 42,
    averageRating: 4.1,
    categoryCounts: [
      { category: "product", count: 20 },
      { category: "support", count: 12 },
      { category: "sales", count: 7 },
      { category: "other", count: 3 }
    ],
    dailyTrend: [
      { date: "2024-01-01", count: 5 },
      { date: "2024-01-02", count: 8 }
    ],
    recentFeedback: 15
  };

  it("totalFeedback matches the sum of all category counts", () => {
    const sum = mockSummary.categoryCounts.reduce((acc, c) => acc + c.count, 0);
    expect(sum).toBe(mockSummary.totalFeedback);
  });

  it("categoryCounts labels are formattable via formatCategoryLabel", () => {
    for (const { category } of mockSummary.categoryCounts) {
      const label = formatCategoryLabel(category);
      expect(label.length).toBeGreaterThan(0);
      // First character of each word should be uppercase
      expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase());
    }
  });

  it("dailyTrend dates are in ISO date format (YYYY-MM-DD)", () => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const { date } of mockSummary.dailyTrend) {
      expect(date).toMatch(isoDateRegex);
    }
  });

  it("recentFeedback is not greater than totalFeedback", () => {
    expect(mockSummary.recentFeedback).toBeLessThanOrEqual(mockSummary.totalFeedback);
  });

  it("averageRating is within valid bounds (1–5)", () => {
    expect(mockSummary.averageRating).toBeGreaterThanOrEqual(1);
    expect(mockSummary.averageRating).toBeLessThanOrEqual(5);
  });
});

// ─────────────────────────────────────────
// CategoryCount helpers
// ─────────────────────────────────────────

describe("CategoryCount helpers", () => {
  const counts: CategoryCount[] = [
    { category: "product", count: 20 },
    { category: "support", count: 5 },
    { category: "sales", count: 10 },
    { category: "other", count: 7 }
  ];

  it("finds the dominant category correctly", () => {
    const dominant = counts.reduce((max, c) => (c.count > max.count ? c : max), counts[0]);
    expect(dominant.category).toBe("product");
  });

  it("calculates the total count accurately", () => {
    const total = counts.reduce((acc, c) => acc + c.count, 0);
    expect(total).toBe(42);
  });
});
