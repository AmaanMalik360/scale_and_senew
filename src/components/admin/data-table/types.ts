import { ReactNode } from "react";

export interface DataTableColumn<T = Record<string, any>> {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface DataTableTab {
  label: string;
  value: string;
  count?: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableProps<T = Record<string, any>> {
  columns: DataTableColumn<T>[];
  data: T[];
  tabs?: DataTableTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (query: string) => void;
  pagination?: PaginationProps;
  onFilter?: () => void;
  onSort?: () => void;
  onAdd?: () => void;
  onMore?: () => void;
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (index: number) => void;
  onSelectAll?: () => void;
}
