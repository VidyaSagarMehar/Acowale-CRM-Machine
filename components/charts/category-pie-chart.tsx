"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCategoryLabel } from "@/lib/utils";
import type { CategoryCount } from "@/types/analytics";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export function CategoryPieChart({ data }: { data: CategoryCount[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="category" innerRadius={70} outerRadius={100} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, formatCategoryLabel(String(name))]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
