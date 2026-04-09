export type FilterOption = {
  label: string;
  value: string;
};

export type RadioRangeFilterOption = {
  label: string;
  values: {
    min?: number;
    max?: number;
  };
};

export type CheckboxFilter = {
  type: "checkbox";
  key: string;           // used as URL param key, e.g. "subcategories"
  label: string;
  options: FilterOption[];
};

export type RadioFilter = {
  type: "radio";
  key: string;           // e.g. "price"
  label: string;
  options: FilterOption[];
  allowCustom?: boolean; // for custom price range
};

export type RadioWithRangeFilter = {
  type: "radios_with_range";
  key: string;           // e.g. "price"
  label: string;
  options: RadioRangeFilterOption[];
  allowCustom?: boolean; // for custom price range
  enforceBoth?: boolean; // require both min and max for custom values
};

export type FilterConfig = CheckboxFilter | RadioFilter | RadioWithRangeFilter;

export type FilterStateItem = {
  type: "checkbox" | "radio" | "radios_with_range";
  key: string;
  value: string[] | { min?: number; max?: number };
};
