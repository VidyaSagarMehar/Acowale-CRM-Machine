import Link from "next/link";

import { PageShell } from "@/components/common/page-shell";
import { SectionHeading } from "@/components/common/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackForm } from "@/features/feedback/feedback-form";

export default function FeedbackPage() {
  return (
    <PageShell className="space-y-8 py-16">
      <SectionHeading
        eyebrow="Public Feedback"
        title="Share what your team is hearing from customers."
        description="This form is public-facing and designed for structured submissions that can flow directly into the admin dashboard."
        action={
          <Link className="text-sm font-semibold text-primary hover:underline" href="/">
            Back to home
          </Link>
        }
      />
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#606060]">Submit feedback</h2>
            <p className="text-sm text-muted-foreground">
              Required fields, email validation, and comment length are enforced on both client and server.
            </p>
          </div>
          <FeedbackForm />
        </CardContent>
      </Card>
    </PageShell>
  );
}
