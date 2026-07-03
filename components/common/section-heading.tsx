import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between w-full">
      <div className="space-y-3 flex-1">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-[#606060] md:text-3xl lg:text-4xl leading-tight">
          {title}
        </h1>
        {/* Subtle Blue Underline Accent */}
        <div className="h-[3px] w-12 bg-primary rounded-full mt-1" />
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base pt-2">{description}</p>
      </div>
      {action ? <div className="mt-4 md:mt-0 flex-shrink-0">{action}</div> : null}
    </div>
  );
}
