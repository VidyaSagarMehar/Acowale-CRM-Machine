"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitFeedback } from "@/features/feedback/api";
import { FEEDBACK_CATEGORIES } from "@/features/feedback/categories";
import { feedbackSchema, type FeedbackFormValues } from "@/features/feedback/schema";
import { formatCategoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "product",
      rating: 5,
      comment: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    const response = await submitFeedback(values);

    if (!response.success) {
      toast.error(response.message, {
        description: response.errors.join(" ")
      });
      setIsSubmitting(false);
      return;
    }

    form.reset();
    toast.success(response.message);
    setIsSubmitting(false);
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          <p className="text-sm text-destructive">{form.formState.errors.name?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          <p className="text-sm text-destructive">{form.formState.errors.email?.message}</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" {...form.register("category")}>
            {FEEDBACK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {formatCategoryLabel(category)}
              </option>
            ))}
          </Select>
          <p className="text-sm text-destructive">{form.formState.errors.category?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Select id="rating" {...form.register("rating")}>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <p className="text-sm text-destructive">{form.formState.errors.rating?.message}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" placeholder="Tell us what worked, what did not, and what would help most next." {...form.register("comment")} />
        <p className="text-sm text-destructive">{form.formState.errors.comment?.message}</p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Submit feedback"}
      </Button>
    </form>
  );
}
