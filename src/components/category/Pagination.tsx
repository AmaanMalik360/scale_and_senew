"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const getPageNumbers = (currentPage: number, totalPages: number): (number | "ellipsis")[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  if (totalPages <= 1 && pageSizeOptions.length <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
  };

  return (
    <section className="w-full py-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30 -ml-2"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {pages.map((page, idx) =>
              page === "ellipsis" ? (
                <span key={`ellipsis-${idx}`} className="mx-2 text-sm font-light text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  className={`min-w-8 h-8 hover:bg-transparent hover:underline text-sm ${
                    page === currentPage ? "underline font-normal" : "font-light"
                  }`}
                  onClick={() => onPageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size-select" className="text-sm font-light text-muted-foreground">
              Show
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="text-sm border border-border rounded px-2 py-1 bg-background"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pagination;