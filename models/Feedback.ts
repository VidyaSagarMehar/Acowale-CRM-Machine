import { Model, Schema, model, models } from "mongoose";

import { FEEDBACK_CATEGORIES } from "@/features/feedback/categories";

export type FeedbackDocument = {
  name: string;
  email: string;
  category: (typeof FEEDBACK_CATEGORIES)[number];
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: true,
      enum: FEEDBACK_CATEGORIES
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

export const FeedbackModel =
  (models.Feedback as Model<FeedbackDocument>) || model<FeedbackDocument>("Feedback", feedbackSchema);
