"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // CHANGED: pl-3 (left) and pr-10 (right) to clear the icon
        className="admin-input pl-3 pr-10 py-2 w-[240px] text-sm"
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-grey)]" />
    </div>
  );
}
