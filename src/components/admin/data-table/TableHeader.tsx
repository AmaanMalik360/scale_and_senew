"use client";

import { DataTableColumn } from "./types";

interface TableHeaderProps<T> {
  columns: DataTableColumn<T>[];
  selectable?: boolean;
  allSelected?: boolean;
  onSelectAll?: () => void;
}

export function TableHeader<T>({
  columns,
  selectable,
  allSelected,
  onSelectAll,
}: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="bg-[var(--admin-accent)]">
        {selectable && (
          <th className="px-4 py-3 w-12">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-brand-primary)]"
            />
          </th>
        )}
        {columns.map((col) => (
          <th
            key={col.key}
            className="px-4 py-3 text-left text-sm font-semibold text-[var(--admin-brand-primary)]"
            style={col.width ? { width: col.width } : undefined}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
