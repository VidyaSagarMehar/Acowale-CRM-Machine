import type { ApiResponse } from "@/types/api";
import type { AnalyticsSummary } from "@/types/analytics";

export async function getAnalytics() {
  const response = await fetch("/api/analytics", {
    cache: "no-store"
  });

  return (await response.json()) as ApiResponse<AnalyticsSummary>;
}
