"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { ChevronDown, Check } from "lucide-react";
import { Category } from "@/state/categories-api";

const flattenCategoriesWithLevel = (
  categories: Category[],
  level: number = 0
): Array<{ category: Category; level: number }> => {
  const result: Array<{ category: Category; level: number }> = [];

  categories.forEach((cat) => {
    result.push({ category: cat, level });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategoriesWithLevel(cat.children, level + 1));
    }
  });

  return result;
};

export interface CategorySelectDropdownProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors<any>;
  categories: Category[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
}

export const CategorySelectDropdown = ({
  name,
  control,
  errors,
  categories,
  label = "Parent Category",
  placeholder = "Select parent category (optional)",
  disabled = false,
  description,
}: CategorySelectDropdownProps) => {
  const flatCategories = flattenCategoriesWithLevel(categories);

  return (
    <div className="space-y-2">
      <Label.Root
        htmlFor={name}
        className="admin-panel text-body font-medium text-[var(--admin-text-primary)]"
      >
        {label}
      </Label.Root>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select.Root
            value={field.value?.toString() || "none"}
            onValueChange={(value) => {
              field.onChange(value === "none" ? null : parseInt(value, 10));
            }}
            disabled={disabled}
          >
            <Select.Trigger
              className="admin-input w-full flex items-center justify-between"
              aria-label={`Select ${label.toLowerCase()}`}
              aria-invalid={errors[name] ? "true" : "false"}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            >
              <Select.Value placeholder={placeholder} />
              <Select.Icon>
                <ChevronDown className="w-4 h-4 text-[var(--admin-grey)]" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                className="admin-panel max-h-[300px] overflow-hidden bg-[var(--admin-bg-white)] rounded-lg shadow-[var(--admin-shadow-6)] border border-[var(--admin-border)] z-50"
                position="popper"
                sideOffset={4}
              >
                <Select.Viewport className="admin-panel p-1 overflow-y-auto">
                  <Select.Item
                    value="none"
                    className="admin-panel relative flex items-center px-8 py-2 text-body-sm text-[var(--admin-text-primary)] rounded-md outline-none cursor-pointer hover:bg-[var(--admin-accent)] focus:bg-[var(--admin-accent)] data-[state=checked]:bg-[var(--admin-accent)]"
                  >
                    <Select.ItemText>None (Root Category)</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check className="w-4 h-4 text-[var(--admin-brand-primary)]" />
                    </Select.ItemIndicator>
                  </Select.Item>

                  <Select.Separator className="h-px bg-[var(--admin-border)] my-1" />

                  {flatCategories.map(({ category, level }) => (
                    <Select.Item
                      key={category.id}
                      value={category.id.toString()}
                      className="admin-panel relative flex items-center px-8 py-2 text-body-sm text-[var(--admin-text-primary)] rounded-md outline-none cursor-pointer hover:bg-[var(--admin-accent)] focus:bg-[var(--admin-accent)] data-[state=checked]:bg-[var(--admin-accent)]"
                    >
                      <Select.ItemText>
                        <span
                          style={{
                            paddingLeft: `${level * 16}px`,
                          }}
                        >
                          {category.name}
                        </span>
                      </Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="w-4 h-4 text-[var(--admin-brand-primary)]" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      />
      {errors[name] && (
        <p
          id={`${name}-error`}
          className="admin-panel text-body-sm text-[var(--admin-error)] mt-1"
          role="alert"
        >
          {errors[name]?.message as string}
        </p>
      )}
      {description && (
        <p className="admin-panel text-caption text-[var(--admin-grey)]">
          {description}
        </p>
      )}
    </div>
  );
};
