import * as React from "react";

import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      className={cn(
        "flex h-11 w-full rounded-input border border-input bg-white px-4 text-sm text-foreground outline-none transition-all duration-150 ease-in-out focus:border-primary focus:ring-2 focus:ring-primary/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Select.displayName = "Select";
