"use client";

import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";
import { FormHTMLAttributes, ReactNode } from "react";

interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  // UseFormReturn third generic (TTransformedValues) varies depending on the
  // resolver; using `any` here keeps the component compatible with zodResolver.
  form: UseFormReturn<TFieldValues, any, any>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  children: ReactNode;
}

export const Form = <TFieldValues extends FieldValues,>({
  form,
  onSubmit,
  children,
  ...rest
}: FormProps<TFieldValues>) => (
  <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit as any)} {...rest}>
      {children}
    </form>
  </FormProvider>
);
