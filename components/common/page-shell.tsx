import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={cn("mx-auto w-full max-w-7xl px-6 py-10 md:px-10", className)}>{children}</main>;
}
