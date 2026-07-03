"use client";

import { Filter, LoaderCircle, LogOut, MessageSquareText, Search, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { DailyTrendChart } from "@/components/charts/daily-trend-chart";
import { EmptyState } from "@/components/common/empty-state";
import { FeedbackTable } from "@/components/common/feedback-table";
import { PageShell } from "@/components/common/page-shell";
import { SectionHeading } from "@/components/common/section-heading";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { logout } from "@/features/auth/api";
import { FEEDBACK_CATEGORIES } from "@/features/feedback/categories";
import { getAnalytics } from "@/features/analytics/api";
import { getFeedbackList } from "@/features/feedback/api";
import { formatCategoryLabel } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useFeedbackStore } from "@/store/feedback-store";
import type { AnalyticsSummary } from "@/types/analytics";
import type { FeedbackListResponse } from "@/types/feedback";

export function DashboardPageClient() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { search, category, page, setSearch, setCategory, setPage } = useFeedbackStore();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      const [analyticsResponse, feedbackResponse] = await Promise.all([
        getAnalytics(),
        getFeedbackList({ search, category, page })
      ]);

      if (cancelled) {
        return;
      }

      if (!analyticsResponse.success) {
        toast.error(analyticsResponse.message);
      } else {
        setAnalytics(analyticsResponse.data);
      }

      if (!feedbackResponse.success) {
        toast.error(feedbackResponse.message);
      } else {
        setFeedbackData(feedbackResponse.data);
      }

      setIsLoading(false);
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [search, category, page]);

  async function handleLogout() {
    const response = await logout();

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <PageShell className="space-y-8">
      <SectionHeading
        eyebrow="Admin Dashboard"
        title="Customer feedback with the right level of operational detail."
        description={`Signed in as ${user?.email ?? "admin@acowale.local"}. Monitor volume, category trends, and the latest submissions from one place.`}
        action={
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        }
      />

      {isLoading && !analytics ? (
        <Card>
          <CardContent className="flex items-center justify-center py-14">
            <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : null}

      {analytics ? (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Feedback"
              value={String(analytics.totalFeedback)}
              description="All feedback records submitted so far."
              icon={MessageSquareText}
            />
            <StatCard
              title="Average Rating"
              value={`${analytics.averageRating}/5`}
              description="Current satisfaction average across all responses."
              icon={Star}
            />
            <StatCard
              title="Past 7 Days"
              value={String(analytics.recentFeedback)}
              description="New submissions captured in the last week."
              icon={TrendingUp}
            />
            <StatCard
              title="Categories"
              value={String(analytics.categoryCounts.length)}
              description="Distinct feedback channels represented in the data."
              icon={Filter}
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#606060]">Category Distribution</h2>
                  <p className="text-sm text-muted-foreground">See where the feedback volume is concentrated.</p>
                </div>
                <CategoryPieChart data={analytics.categoryCounts} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#606060]">Daily Trend</h2>
                  <p className="text-sm text-muted-foreground">Track how submissions change over time.</p>
                </div>
                <DailyTrendChart data={analytics.dailyTrend} />
              </CardContent>
            </Card>
          </section>
        </>
      ) : null}

      <section className="space-y-5">
        <Card>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search by name, email, or comment"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Select className="md:w-60" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
                <option value="all">All categories</option>
                {FEEDBACK_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {formatCategoryLabel(item)}
                  </option>
                ))}
              </Select>
            </div>

            {feedbackData?.items.length ? (
              <>
                <FeedbackTable items={feedbackData.items} />
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Page {feedbackData.pagination.page} of {feedbackData.pagination.totalPages}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      disabled={feedbackData.pagination.page <= 1}
                      onClick={() => setPage(Math.max(1, page - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={feedbackData.pagination.page >= feedbackData.pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                title="No feedback found"
                description="Try adjusting the search query or category filter to find matching submissions."
              />
            )}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
