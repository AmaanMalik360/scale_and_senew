"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { DataTableProps } from "./types";
import { ToggleBar } from "./ToggleBar";
import { SearchBar } from "./SearchBar";
import { FilterButton } from "./FilterButton";
import { SortButton } from "./SortButton";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { Pagination } from "./Pagination";

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder,
  searchValue,
  onSearch,
  pagination,
  onFilter,
  onSort,
  onAdd,
  onMore,
  selectable = false,
  selectedRows,
  onSelectRow,
  onSelectAll,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");

  const searchVal = searchValue ?? internalSearch;
  const handleSearch = onSearch ?? setInternalSearch;
  const allSelected =
    selectable && data.length > 0 && selectedRows?.size === data.length;

  return (
    <div className="admin-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--admin-border-light)]">
        {/* Left: Tabs */}
        <div className="flex items-center">
          {tabs && activeTab && onTabChange && (
            <ToggleBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          )}
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2">
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchVal}
            onChange={handleSearch}
          />
          <FilterButton onClick={onFilter} />
          {onSort && <SortButton onClick={onSort} />}
          {onAdd && (
            <button onClick={onAdd} className="admin-icon-btn">
              <Plus className="w-4 h-4" />
            </button>
          )}
          {onMore && (
            <button onClick={onMore} className="admin-icon-btn">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            columns={columns}
            selectable={selectable}
            allSelected={allSelected}
            onSelectAll={onSelectAll}
          />
          <TableBody
            columns={columns}
            data={data}
            selectable={selectable}
            selectedRows={selectedRows}
            onSelectRow={onSelectRow}
          />
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="border-t border-[var(--admin-border-light)]">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
