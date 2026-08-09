"use client";

import * as Label from "@radix-ui/react-label";
import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface FormFieldWrapperProps {
  name: string;
  label?: string;
  required?: boolean;
  description?: string;
  error?: FieldError;
  children: ReactNode;
  className?: string;
}

export const FormFieldWrapper = ({
  name,
  label,
  required,
  description,
  error,
  children,
  className,
}: FormFieldWrapperProps) => (
  <div className={`space-y-2 ${className ?? ""}`}>
    {label && (
      <Label.Root
        htmlFor={name}
        className="text-body-sm font-medium text-[var(--admin-text-primary)]"
      >
        {label}
        {required && (
          <span className="text-[var(--admin-error)] ml-0.5">*</span>
        )}
      </Label.Root>
    )}
    {children}
    {error && (
      <p
        id={`${name}-error`}
        className="text-body-sm text-[var(--admin-error)]"
        role="alert"
      >
        {error.message as string}
      </p>
    )}
    {description && !error && (
      <p className="text-caption text-[var(--admin-grey)]">{description}</p>
    )}
  </div>
);
