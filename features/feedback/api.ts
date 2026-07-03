import type { FeedbackFormValues } from "@/features/feedback/schema";
import type { ApiResponse } from "@/types/api";
import type { FeedbackListResponse, FeedbackRecord } from "@/types/feedback";

export async function submitFeedback(values: FeedbackFormValues) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  });

  return (await response.json()) as ApiResponse<{ feedback: FeedbackRecord }>;
}

export async function getFeedbackList(params: {
  search: string;
  category: string;
  page: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams({
    search: params.search,
    category: params.category,
    page: String(params.page),
    pageSize: String(params.pageSize ?? 10)
  });

  const response = await fetch(`/api/feedback?${searchParams.toString()}`, {
    cache: "no-store"
  });

  return (await response.json()) as ApiResponse<FeedbackListResponse>;
}
