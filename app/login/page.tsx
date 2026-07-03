import Link from "next/link";
import { Shield } from "lucide-react";

import { PageShell } from "@/components/common/page-shell";
import { SectionHeading } from "@/components/common/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-screen items-center py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <SectionHeading
            eyebrow="Admin Access"
            title="Sign in to review feedback trends and team-facing insights."
            description="Use the seeded admin credentials from the spec to access the protected dashboard and analytics routes."
          />
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Seeded credentials</p>
            <p className="mt-2">Email: admin@acowale.local</p>
            <p>Password: Admin@123</p>
            <Link className="mt-4 inline-block text-primary" href="/">
              Return to home
            </Link>
          </div>
        </div>
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="text-sm text-muted-foreground">JWT session cookies keep dashboard access protected across requests.</p>
            </div>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
