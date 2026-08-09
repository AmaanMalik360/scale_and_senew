"use client";

import { useFormContext, FieldValues, Path, get } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface TextAreaFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  rows?: number;
}

export const TextAreaField = <T extends FieldValues,>({
  name,
  label,
  placeholder,
  required,
  description,
  disabled,
  rows = 4,
}: TextAreaFieldProps<T>) => {
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
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="admin-input w-full min-h-[120px] resize-y"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
    </FormFieldWrapper>
  );
};
