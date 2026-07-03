import { z } from "zod";

import { FEEDBACK_CATEGORIES } from "@/features/feedback/categories";

export const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  category: z.enum(FEEDBACK_CATEGORIES),
  rating: z.coerce.number().min(1, "Rating is required.").max(5, "Rating must be between 1 and 5."),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters.")
    .max(500, "Comment cannot exceed 500 characters.")
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
