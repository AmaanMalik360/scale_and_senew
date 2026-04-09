"use client";

import { ArrowUpDown } from "lucide-react";

interface SortButtonProps {
  onClick?: () => void;
}

export function SortButton({ onClick }: SortButtonProps) {
  return (
    <button onClick={onClick} className="admin-icon-btn" title="Sort">
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );
}
