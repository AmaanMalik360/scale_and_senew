"use client";

import { useEffect, useState } from "react";
import { useController, useFormContext, FieldValues, Path, get } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface CurrencyFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  // NOTE (future — multi-currency): Pass currencySymbol derived from the active
  // Currency.symbol returned by the API rather than hard-coding it here.
  currencySymbol?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Stores value in minor units (paisa for PKR). Display is a human-typed "2500.00" string.
// Syncs display off field.value so form.reset() on edit correctly re-derives the display string.
export const CurrencyField = <T extends FieldValues,>({
  name,
  label,
  required,
  currencySymbol = "Rs",
  placeholder = "0.00",
  disabled,
}: CurrencyFieldProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const { field } = useController({ name, control });
  const error = get(errors, name);

  const [display, setDisplay] = useState(() =>
    field.value ? (Number(field.value) / 100).toFixed(2) : ""
  );

  // Re-sync display when value changes from outside (e.g. form.reset() on edit page load).
  useEffect(() => {
    const expected = field.value ? (Number(field.value) / 100).toFixed(2) : "";
    const currentAsCents = Math.round(parseFloat(display || "0") * 100);
    if (currentAsCents !== Number(field.value ?? 0)) {
      setDisplay(expected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setDisplay(raw);
    field.onChange(Math.round(parseFloat(raw || "0") * 100));
  };

  return (
    <FormFieldWrapper name={name} label={label} required={required} error={error}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-grey)]">
          {currencySymbol}
        </span>
        <input
          id={name}
          type="text"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="admin-input w-full pl-7"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
    </FormFieldWrapper>
  );
};
