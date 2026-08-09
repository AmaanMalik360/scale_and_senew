"use client";

import { useFormContext, FieldValues, Path, get } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface NumberFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const NumberField = <T extends FieldValues,>({
  name,
  label,
  placeholder,
  required,
  description,
  disabled,
  min,
  max,
}: NumberFieldProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name);

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      required={required}
      description={description}
      error={error}
    >
      <input
        id={name}
        type="number"
        min={min}
        max={max}
        {...register(name, { valueAsNumber: true })}
        placeholder={placeholder}
        disabled={disabled}
        className="admin-input w-full"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
    </FormFieldWrapper>
  );
};
