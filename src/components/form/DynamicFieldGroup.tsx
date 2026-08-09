"use client";

import { useEffect } from "react";
import { useController, useFormContext, FieldValues, Path, get } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface DynamicFieldDescriptor {
  key: string;
  label: string;
  options: { value: number | string; label: string }[];
  required?: boolean;
}

interface DynamicFieldGroupProps<T extends FieldValues> {
  name: Path<T>;
  descriptors: DynamicFieldDescriptor[];
  label?: string;
}

// Renders N selects for a Record<key, value> field whose set of keys comes from
// runtime data (e.g. category attributes). Prunes stale keys automatically when
// `descriptors` changes (e.g. user switches category), so the form model never
// holds values for fields that no longer exist.
export const DynamicFieldGroup = <T extends FieldValues,>({
  name,
  descriptors,
  label,
}: DynamicFieldGroupProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const { field } = useController({ name, control });
  const error = get(errors, name);
  const value: Record<string, number | string> = field.value ?? {};

  useEffect(() => {
    const validKeys = new Set(descriptors.map((d) => d.key));
    const pruned = Object.fromEntries(
      Object.entries(value).filter(([k]) => validKeys.has(k))
    );
    if (Object.keys(pruned).length !== Object.keys(value).length) {
      field.onChange(pruned);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptors]);

  const handleSetKey = (key: string, val: number | string | undefined) => {
    const next = { ...value };
    if (val === undefined) delete next[key];
    else next[key] = val;
    field.onChange(next);
  };

  return (
    <FormFieldWrapper name={name} label={label} error={error}>
      <div className="space-y-4">
        {descriptors.map((d) => (
          <div key={d.key} className="space-y-2">
            <label className="text-body-sm font-medium text-[var(--admin-text-primary)]">
              {d.label}
              {d.required && (
                <span className="text-[var(--admin-error)] ml-0.5">*</span>
              )}
            </label>
            <select
              className="admin-input w-full"
              value={value[d.key] ?? ""}
              onChange={(e) =>
                handleSetKey(
                  d.key,
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              aria-label={`Select ${d.label}`}
            >
              <option value="">Select {d.label}</option>
              {d.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </FormFieldWrapper>
  );
};
