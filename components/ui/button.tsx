import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-[#0084f0]",
  secondary: "bg-white text-primary border border-primary hover:bg-primary/5",
  ghost: "text-foreground hover:bg-primary/10",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-button px-5 text-sm font-semibold transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
