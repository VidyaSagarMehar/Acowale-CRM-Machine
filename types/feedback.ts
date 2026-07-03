import type { FEEDBACK_CATEGORIES } from "@/features/feedback/categories";

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export type FeedbackRecord = {
  id: string;
  name: string;
  email: string;
  category: FeedbackCategory;
  rating: number;
  comment: string;
  createdAt: string;
};

export type FeedbackListResponse = {
  items: FeedbackRecord[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
