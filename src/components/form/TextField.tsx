"use client";

import { useFormContext, FieldValues, Path, get } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password";
}

export const TextField = <T extends FieldValues,>({
  name,
  label,
  placeholder,
  required,
  description,
  disabled,
  type = "text",
}: TextFieldProps<T>) => {
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
        type={type}
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        className="admin-input w-full"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
    </FormFieldWrapper>
  );
};
