"use client";

import { useEffect, useState } from "react";
import { Modal } from "../Modal";

export interface AttributeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<void>;
  initialName?: string;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export const AttributeFormModal = ({
  open,
  onOpenChange,
  onSubmit,
  initialName = "",
  isLoading = false,
  mode = "create",
}: AttributeFormModalProps) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
    }
  }, [open, initialName]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Attribute name is required");
      return;
    }
    try {
      await onSubmit(name.trim());
      setName("");
      setError("");
    } catch (err: any) {
      setError(err?.data?.detail || `Failed to ${mode} attribute`);
    }
  };

  const isCreate = mode === "create";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isCreate ? "Add New Attribute" : "Edit Attribute"}
      description={
        isCreate
          ? "Create a new attribute dimension (e.g. Material, Color, Size)"
          : `Update the name of this attribute`
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
                ? "Creating..."
                : "Saving..."
              : isCreate
              ? "Create Attribute"
              : "Save Changes"}
          </button>
        </>
      }
    >
      <div className="space-y-2">
        <label
          htmlFor="attribute-form-name"
          className="text-body font-medium text-[var(--admin-text-primary)]"
        >
          Attribute Name <span className="text-[var(--admin-error)]">*</span>
        </label>
        <input
          id="attribute-form-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="e.g. Material, Color, Size"
          className="admin-input w-full"
          autoFocus
          aria-invalid={!!error}
          aria-describedby={error ? "attribute-form-name-error" : undefined}
        />
        {error && (
          <p
            id="attribute-form-name-error"
            className="text-body-sm text-[var(--admin-error)]"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
};
