"use client";

import { Controller, useFormContext, FieldValues, Path, get } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface CheckboxOption {
  value: number | string;
  label: string;
}

interface CheckboxGroupFieldProps<T extends FieldValues> {
  name: Path<T>;
  options: CheckboxOption[];
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const CheckboxGroupField = <T extends FieldValues,>({
  name,
  options,
  label,
  description,
  disabled,
}: CheckboxGroupFieldProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name);

  return (
    <FormFieldWrapper name={name} label={label} description={description} error={error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const current: Array<number | string> = field.value ?? [];

          return (
            <div className="border border-[var(--admin-border)] rounded-lg max-h-48 overflow-y-auto divide-y divide-[var(--admin-border-light)]">
              {options.map((opt) => {
                const checked = current.includes(opt.value);
                const handleToggle = () => {
                  field.onChange(
                    checked
                      ? current.filter((v) => v !== opt.value)
                      : [...current, opt.value]
                  );
                };

                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--admin-accent)] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleToggle}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-brand-primary)]"
                    />
                    <span className="text-body-sm text-[var(--admin-text-primary)]">
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
    </FormFieldWrapper>
  );
};
