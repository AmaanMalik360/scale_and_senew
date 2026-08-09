"use client";

import { Controller, useFormContext, FieldValues, Path, get } from "react-hook-form";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface SelectOption {
  value: string;
  label: string;
  level?: number;
}

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  noneOption?: { value: string; label: string } | null;
  disabled?: boolean;
  description?: string;
  parseValue?: (value: string) => unknown;
  serializeValue?: (value: unknown) => string;
}

// Items and the portal content need `admin-panel` because Radix renders Select.Portal
// at document.body — outside the `.admin-panel` scope where CSS variables are defined.
const itemClass =
  "admin-panel relative flex items-center px-8 py-2 text-body-sm text-[var(--admin-text-primary)] rounded-md outline-none cursor-pointer hover:bg-[var(--admin-accent)] focus:bg-[var(--admin-accent)] data-[state=checked]:bg-[var(--admin-accent)]";

export const SelectField = <T extends FieldValues,>({
  name,
  label,
  placeholder = "Select an option",
  options,
  noneOption = null,
  disabled,
  description,
  parseValue = (v) => v,
  serializeValue = (v) =>
    v === null || v === undefined ? "none" : String(v),
}: SelectFieldProps<T>) => {
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
        render={({ field }) => (
          <Select.Root
            value={serializeValue(field.value)}
            onValueChange={(value) => {
              field.onChange(value === "none" ? null : parseValue(value));
            }}
            disabled={disabled}
          >
            <Select.Trigger
              className="admin-input w-full flex items-center justify-between"
              aria-label={label ?? name}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${name}-error` : undefined}
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
                  {noneOption && (
                    <>
                      <Select.Item value={noneOption.value} className={itemClass}>
                        <Select.ItemText>{noneOption.label}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                          <Check className="w-4 h-4 text-[var(--admin-brand-primary)]" />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Separator className="h-px bg-[var(--admin-border)] my-1" />
                    </>
                  )}
                  {options.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value} className={itemClass}>
                      <Select.ItemText>
                        <span style={{ paddingLeft: `${(opt.level ?? 0) * 16}px` }}>
                          {opt.label}
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
    </FormFieldWrapper>
  );
};
