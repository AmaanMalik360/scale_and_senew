"use client";

import { useEffect, useState } from "react";
import { Modal } from "../Modal";

export interface FlatCategory {
  id: number;
  name: string;
  level: number;
}

export interface AttributeValueFormData {
  value: string;
  category_id: number | null;
}

export interface AttributeValueFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AttributeValueFormData) => Promise<void>;
  attributeName?: string;
  initialData?: AttributeValueFormData;
  flatCategories: FlatCategory[];
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export const AttributeValueFormModal = ({
  open,
  onOpenChange,
  onSubmit,
  attributeName,
  initialData,
  flatCategories,
  isLoading = false,
  mode = "create",
}: AttributeValueFormModalProps) => {
  const [value, setValue] = useState(initialData?.value ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.category_id ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValue(initialData?.value ?? "");
      setCategoryId(initialData?.category_id ?? null);
      setError("");
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError("Value is required");
      return;
    }
    try {
      await onSubmit({ value: value.trim(), category_id: categoryId });
      setValue("");
      setCategoryId(null);
      setError("");
    } catch (err: any) {
      setError(err?.data?.detail || `Failed to ${mode} attribute value`);
    }
  };

  const isCreate = mode === "create";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isCreate ? "Add Attribute Value" : "Edit Attribute Value"}
      description={
        isCreate
          ? attributeName
            ? `Add a new value to the "${attributeName}" attribute`
            : "Add a new attribute value"
          : `Update the value "${initialData?.value ?? ""}"`
      }
      size="sm"
      closeOnOverlayClick={!isLoading}
      footer={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="admin-btn-primary"
          >
            {isLoading
              ? isCreate
                ? "Adding..."
                : "Saving..."
              : isCreate
              ? "Add Value"
              : "Save Changes"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Value input */}
        <div className="space-y-2">
          <label
            htmlFor="attr-value-form-input"
            className="text-body font-medium text-[var(--admin-text-primary)]"
          >
            Value <span className="text-[var(--admin-error)]">*</span>
          </label>
          <input
            id="attr-value-form-input"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="e.g. Leather, Gold, Large"
            className="admin-input w-full"
            autoFocus
            aria-invalid={!!error}
            aria-describedby={error ? "attr-value-form-error" : undefined}
          />
          {error && (
            <p
              id="attr-value-form-error"
              className="text-body-sm text-[var(--admin-error)]"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        {/* Category scope select */}
        <div className="space-y-2">
          <label
            htmlFor="attr-value-form-category"
            className="text-body font-medium text-[var(--admin-text-primary)]"
          >
            Scope to Category{" "}
            <span className="text-[var(--admin-grey)] font-normal">(optional)</span>
          </label>
          <select
            id="attr-value-form-category"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="admin-input w-full"
          >
            <option value="">Global (visible in all categories)</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {"  ".repeat(cat.level)}
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-caption text-[var(--admin-grey)]">
            Leave empty to make this value global across all categories
          </p>
        </div>
      </div>
    </Modal>
  );
};
