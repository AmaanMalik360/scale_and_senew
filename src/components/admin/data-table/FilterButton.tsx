"use client";

import { SlidersHorizontal } from "lucide-react";

interface FilterButtonProps {
  onClick?: () => void;
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <button onClick={onClick} className="admin-icon-btn" title="Filter">
      <SlidersHorizontal className="w-4 h-4" />
    </button>
  );
}
