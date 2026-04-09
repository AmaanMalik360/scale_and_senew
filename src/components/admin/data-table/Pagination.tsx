"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { PaginationProps } from "./types";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm font-medium text-[var(--admin-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[var(--admin-brand-primary)] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, i) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-sm text-[var(--admin-grey)]"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-[var(--admin-brand-primary)] text-white"
                    : "text-[var(--admin-text-primary)] hover:bg-[var(--admin-accent)]"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {pageSizeOptions && onPageSizeChange && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-[var(--admin-grey)]">Rows per page:</span>
            <select
              value={pageSize || pageSizeOptions[0]}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-3 py-1.5 text-sm border border-[var(--admin-border-light)] rounded-lg bg-[var(--admin-bg-white)] text-[var(--admin-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand-primary)]"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-sm font-medium text-[var(--admin-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[var(--admin-brand-primary)] transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
