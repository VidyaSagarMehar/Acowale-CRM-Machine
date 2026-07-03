import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/features/auth/constants";
import { FEEDBACK_CATEGORIES } from "@/features/feedback/categories";
import { feedbackSchema } from "@/features/feedback/schema";
import { apiError, apiSuccess } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { verifyAuthToken } from "@/lib/jwt";
import { getZodErrorMessages } from "@/lib/validation";
import { FeedbackModel } from "@/models/Feedback";

const DEFAULT_PAGE_SIZE = 10;

function mapFeedback(feedback: {
  _id?: { toString(): string };
  id?: string;
  name: string;
  email: string;
  category: string;
  rating: number;
  comment: string;
  createdAt: Date;
}) {
  return {
    id: feedback.id ?? feedback._id?.toString() ?? "",
    name: feedback.name,
    email: feedback.email,
    category: feedback.category,
    rating: feedback.rating,
    comment: feedback.comment,
    createdAt: feedback.createdAt.toISOString()
  };
}

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Validation failed.", getZodErrorMessages(parsed.error), 422);
    }

    await connectToDatabase();

    const feedback = await FeedbackModel.create(parsed.data);

    return apiSuccess({ feedback: mapFeedback(feedback) }, "Feedback submitted successfully.", 201);
  } catch (error) {
    return apiError("Unable to submit feedback.", [error instanceof Error ? error.message : "Unknown error"], 500);
  }
}

export async function GET(request: Request) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return apiError("Unauthorized.", [], 401);
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category") ?? "all";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.max(1, Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE));

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } }
      ];
    }

    if (category !== "all" && FEEDBACK_CATEGORIES.includes(category as (typeof FEEDBACK_CATEGORIES)[number])) {
      query.category = category;
    }

    const [items, totalItems] = await Promise.all([
      FeedbackModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      FeedbackModel.countDocuments(query)
    ]);

    return apiSuccess(
      {
        items: items.map(mapFeedback),
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.max(1, Math.ceil(totalItems / pageSize))
        }
      },
      "Feedback fetched successfully."
    );
  } catch (error) {
    return apiError("Unable to fetch feedback.", [error instanceof Error ? error.message : "Unknown error"], 500);
  }
}
