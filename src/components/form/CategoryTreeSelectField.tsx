"use client";

import { FieldValues, Path } from "react-hook-form";
import { SelectField } from "./SelectField";
import { Category } from "@/state/categories-api";

// Context-based counterpart to CategorySelectDropdown.
// CategorySelectDropdown (which accepts explicit control/errors props) is kept for
// components that manage their own form instance (e.g. CategoryFormModal).
// This component pulls context from FormProvider, for use in Form-wrapped pages.

const flattenCategoriesWithLevel = (
  categories: Category[],
  level = 0
): Array<{ category: Category; level: number }> => {
  const result: Array<{ category: Category; level: number }> = [];
  categories.forEach((cat) => {
    result.push({ category: cat, level });
    if (cat.children?.length) {
      result.push(...flattenCategoriesWithLevel(cat.children, level + 1));
    }
  });
  return result;
};

interface CategoryTreeSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  categories: Category[];
  label?: string;
  placeholder?: string;
  noneOptionText?: string;
  disabled?: boolean;
  description?: string;
}

export const CategoryTreeSelectField = <T extends FieldValues,>({
  name,
  categories,
  label = "Category",
  placeholder = "Select a category",
  noneOptionText = "No Category",
  disabled,
  description,
}: CategoryTreeSelectFieldProps<T>) => {
  const options = flattenCategoriesWithLevel(categories).map(({ category, level }) => ({
    value: category.id.toString(),
    label: category.name,
    level,
  }));

  return (
    <SelectField<T>
      name={name}
      label={label}
      placeholder={placeholder}
      options={options}
      noneOption={{ value: "none", label: noneOptionText }}
      disabled={disabled}
      description={description}
      parseValue={(v) => parseInt(v as string, 10)}
    />
  );
};
