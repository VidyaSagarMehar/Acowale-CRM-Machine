"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DailyTrendPoint } from "@/types/analytics";

export function DailyTrendChart({ data }: { data: DailyTrendPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-1))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
