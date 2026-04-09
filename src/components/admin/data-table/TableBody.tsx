"use client";

import React from "react";
import { DataTableColumn } from "./types";

interface TableBodyProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (index: number) => void;
}

export function TableBody<T extends Record<string, unknown>>({
  columns,
  data,
  selectable,
  selectedRows,
  onSelectRow,
}: TableBodyProps<T>) {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-[var(--admin-border-light)] hover:bg-[#f0faf4] transition-colors"
        >
          {selectable && (
            <td className="px-4 py-3 w-12">
              <input
                type="checkbox"
                checked={selectedRows?.has(rowIndex) ?? false}
                onChange={() => onSelectRow?.(rowIndex)}
                className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-brand-primary)]"
              />
            </td>
          )}
          {columns.map((col) => (
            <td
              key={col.key}
              className="px-4 py-3 text-sm text-[var(--admin-text-primary)]"
            >
              {col.render
                ? col.render(row[col.key], row, rowIndex)
                : (row[col.key] as React.ReactNode)}
            </td>
          ))}
        </tr>
      ))}
      {data.length === 0 && (
        <tr>
          <td
            colSpan={columns.length + (selectable ? 1 : 0)}
            className="px-4 py-12 text-center text-sm text-[var(--admin-grey)]"
          >
            No data available
          </td>
        </tr>
      )}
    </tbody>
  );
}
