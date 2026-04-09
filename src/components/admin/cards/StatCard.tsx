"use client";

import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  period?: string;
  onMore?: () => void;
}

export function StatCard({
  title,
  value,
  trend,
  period = "Last 7 days",
  onMore,
}: StatCardProps) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-[var(--admin-text-secondary)]">
          {title}
        </p>
        {onMore && (
          <button
            onClick={onMore}
            className="text-[var(--admin-grey)] hover:text-[var(--admin-text-primary)] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-[28px] font-bold leading-none text-[var(--admin-brand-secondary)]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-sm font-semibold ${
              trend.direction === "up"
                ? "text-[var(--admin-success)]"
                : "text-[var(--admin-error)]"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      {period && <p className="mt-1 text-caption">{period}</p>}
    </div>
  );
}
