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
        <Card className="overflow-hidden border-none bg-slate-950 text-white">
          <CardContent className="space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.35),transparent_35%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Designed for clarity</p>
            <div className="grid gap-4">
              <div className="rounded-2xl bg-white/8 p-5 backdrop-blur">
                <p className="text-sm text-slate-300">Protected dashboard</p>
                <p className="mt-2 text-2xl font-semibold">JWT session + middleware guard</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-5 backdrop-blur">
                <p className="text-sm text-slate-300">Analytics snapshot</p>
                <p className="mt-2 text-2xl font-semibold">Charts, filters, search, and pagination</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardContent className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
