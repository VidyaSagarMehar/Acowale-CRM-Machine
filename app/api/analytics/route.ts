import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/features/auth/constants";
import { apiError, apiSuccess } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { verifyAuthToken } from "@/lib/jwt";
import { FeedbackModel } from "@/models/Feedback";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    await verifyAuthToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return apiError("Unauthorized.", [], 401);
  }

  try {
    await connectToDatabase();

    const [totalFeedback, averageRatingResult, categoryCounts, dailyTrend, recentFeedback] = await Promise.all([
      FeedbackModel.countDocuments(),
      FeedbackModel.aggregate<{ averageRating: number }>([
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" }
          }
        }
      ]),
      FeedbackModel.aggregate<{ category: string; count: number }>([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1
          }
        }
      ]),
      FeedbackModel.aggregate<{ date: string; count: number }>([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1
          }
        },
        {
          $sort: {
            date: 1
          }
        }
      ]),
      FeedbackModel.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        }
      })
    ]);

    return apiSuccess(
      {
        totalFeedback,
        averageRating: Number((averageRatingResult[0]?.averageRating ?? 0).toFixed(1)),
        categoryCounts,
        dailyTrend,
        recentFeedback
      },
      "Analytics fetched successfully."
    );
  } catch (error) {
    return apiError("Unable to fetch analytics.", [error instanceof Error ? error.message : "Unknown error"], 500);
  }
}
