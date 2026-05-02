"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Label from "@radix-ui/react-label";
import { Modal, ModalSize } from "./Modal";
import { Category } from "@/state/categories-api";
import { CategorySelectDropdown } from "@/components/admin/dropdown/CategorySelectDropdown";
import { Attribute } from "@/state/attributes-api";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-&']+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, ampersands, and apostrophes"
    ),
  parent_id: z.number().nullable().optional(),
  attribute_ids: z.array(z.number()),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void | Promise<void>;
  categories: Category[];
  attributes?: Attribute[];
  initialData?: Partial<CategoryFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  size?: ModalSize;
}

export const CategoryFormModal = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
  attributes = [],
  initialData,
  isLoading = false,
  mode = "create",
  size = "md",
}: CategoryFormModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      parent_id: initialData?.parent_id || null,
      attribute_ids: initialData?.attribute_ids || [],
    },
  });

  useEffect(() => {
    console.log("initialData", initialData);
    console.log("attributes", attributes);
    if (open) {
      reset({
        name: initialData?.name || "",
        parent_id: initialData?.parent_id || null,
        attribute_ids: initialData?.attribute_ids || [],
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={mode === "create" ? "Add New Category" : "Edit Category"}
      description={
        mode === "create"
          ? "Create a new category for organizing your products"
          : "Update category information"
      }
      size={size}
      closeOnOverlayClick={!isSubmitting && !isLoading}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting || isLoading}
            className="admin-btn-primary"
          >
            {isSubmitting || isLoading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Category"
              : "Update Category"}
          </button>
        </>
      }
    >
      <form
        id="category-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Category Name Field */}
        <div className="space-y-2">
          <Label.Root
            htmlFor="name"
            className="text-body font-medium text-[var(--admin-text-primary)]"
          >
            Category Name <span className="text-[var(--admin-error)]">*</span>
          </Label.Root>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Enter category name"
            className="admin-input w-full"
            disabled={isSubmitting || isLoading}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-body-sm text-[var(--admin-error)] mt-1"
              role="alert"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Parent Category Field */}
        <CategorySelectDropdown
          name="parent_id"
          control={control}
          errors={errors}
          categories={categories}
          label="Parent Category"
          placeholder="Select parent category (optional)"
          disabled={isSubmitting || isLoading}
          description="Leave empty to create a root category, or select a parent to create a subcategory"
        />

        {/* Attributes Multi-Select */}
        {attributes.length > 0 && (
          <div className="space-y-2">
            <Label.Root className="text-body font-medium text-[var(--admin-text-primary)]">
              Filterable Attributes
            </Label.Root>
            <p className="text-caption text-[var(--admin-grey)]">
              Select attributes that can be used to filter products in this category
            </p>
            <Controller
              name="attribute_ids"
              control={control}
              render={({ field }) => (
                <div className="border border-[var(--admin-border)] rounded-lg max-h-48 overflow-y-auto divide-y divide-[var(--admin-border-light)]">
                  {attributes.map((attr) => {
                    const checked = (field.value ?? []).includes(attr.id);
                    const handleToggle = () => {
                      const current = field.value ?? [];
                      field.onChange(
                        checked
                          ? current.filter((id: number) => id !== attr.id)
                          : [...current, attr.id]
                      );
                    };
                    return (
                      <label
                        key={attr.id}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--admin-accent)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={handleToggle}
                          disabled={isSubmitting || isLoading}
                          className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-brand-primary)]"
                        />
                        <span className="text-body-sm text-[var(--admin-text-primary)]">
                          {attr.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        )}
      </form>
    </Modal>
  );
};
