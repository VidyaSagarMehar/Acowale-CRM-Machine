import type { FeedbackCategory } from "@/types/feedback";

export type CategoryCount = {
  category: FeedbackCategory;
  count: number;
};

export type DailyTrendPoint = {
  date: string;
  count: number;
};

export type AnalyticsSummary = {
  totalFeedback: number;
  averageRating: number;
  categoryCounts: CategoryCount[];
  dailyTrend: DailyTrendPoint[];
  recentFeedback: number;
};
