"use client";

import { DataTableTab } from "./types";

interface ToggleBarProps {
  tabs: DataTableTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ToggleBar({ tabs, activeTab, onTabChange }: ToggleBarProps) {
  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              isActive
                ? "border-[var(--admin-brand-primary)] text-[var(--admin-brand-primary)] bg-white"
                : "border-transparent text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1 ${
                  isActive
                    ? "text-[var(--admin-brand-primary)]"
                    : "text-[var(--admin-grey)]"
                }`}
              >
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
