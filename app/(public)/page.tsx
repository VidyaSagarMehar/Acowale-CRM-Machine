import Link from "next/link";
import { ArrowRight, ChartColumnIncreasing, ShieldCheck, Star } from "lucide-react";

import { PageShell } from "@/components/common/page-shell";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Collect structured feedback",
    description: "Capture customer sentiment with clean validation and consistent categories.",
    icon: Star
  },
  {
    title: "Protect admin workflows",
    description: "JWT-based authentication keeps internal analytics behind a secure dashboard.",
    icon: ShieldCheck
  },
  {
    title: "Track trends quickly",
    description: "See volume, average rating, category mix, and recent activity in one place.",
    icon: ChartColumnIncreasing
  }
];

export default function LandingPage() {
  return (
    <PageShell className="space-y-10 py-16 md:py-24">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Acowale CRM Machine"
            title="Feedback operations built like a real product foundation."
            description="Collect customer feedback, protect internal access, and give your team a clean analytics dashboard from the first release."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/feedback">
              <Button className="w-full sm:w-auto">
                Submit feedback
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button className="w-full sm:w-auto" variant="secondary">
                Admin login
              </Button>
            </Link>
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-8">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">Designed for clarity</p>
            <div className="grid gap-4">
              <div className="rounded-lg bg-background border border-border/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Protected dashboard</p>
                <p className="mt-1 text-xl font-bold text-foreground">JWT session + middleware guard</p>
              </div>
              <div className="rounded-lg bg-background border border-border/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Analytics snapshot</p>
                <p className="mt-1 text-xl font-bold text-foreground">Charts, filters, search, and pagination</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="hover:shadow-card-hover transition-shadow duration-150 ease-in-out">
            <CardContent className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[#606060]">{title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
