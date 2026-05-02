"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumn } from "@/components/admin/data-table/types";
import { Modal } from "@/components/admin/modals/Modal";
import { useGetCategoriesQuery } from "@/state/categories-api";
import {
  useGetAttributeQuery,
  useCreateAttributeValueMutation,
  AttributeValue,
} from "@/state/attributes-api";

export default function AttributeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attributeId = Number(params.id);

  const { data: attribute, isLoading } = useGetAttributeQuery(attributeId);
  const { data: categories = [] } = useGetCategoriesQuery({});
  const [createAttributeValue, { isLoading: isCreating }] = useCreateAttributeValueMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [valueError, setValueError] = useState("");

  const handleOpenModal = () => {
    setNewValue("");
    setSelectedCategoryId(null);
    setValueError("");
    setIsModalOpen(true);
  };

  const handleCreateValue = async () => {
    if (!newValue.trim()) {
      setValueError("Value is required");
      return;
    }
    try {
      await createAttributeValue({
        attributeId,
        value: {
          value: newValue.trim(),
          category_id: selectedCategoryId,
        },
      }).unwrap();
      setIsModalOpen(false);
      setNewValue("");
      setSelectedCategoryId(null);
      setValueError("");
    } catch (error: any) {
      setValueError(error?.data?.detail || "Failed to create attribute value");
    }
  };

  const getCategoryName = (categoryId: number | null | undefined): string => {
    if (!categoryId) return "Global";
    const findCategory = (cats: typeof categories): string | null => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat.name;
        if (cat.children?.length) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findCategory(categories) ?? "Global";
  };

  const flatCategories = (() => {
    const result: { id: number; name: string; level: number }[] = [];
    const flatten = (cats: typeof categories, level: number) => {
      cats.forEach((cat) => {
        result.push({ id: cat.id, name: cat.name, level });
        if (cat.children?.length) flatten(cat.children, level + 1);
      });
    };
    flatten(categories, 0);
    return result;
  })();

  const columns: DataTableColumn<AttributeValue>[] = [
    {
      key: "index",
      label: "No.",
      width: "60px",
      render: (_value, _row, index) => (
        <span className="text-body-sm text-[var(--admin-grey)]">{index + 1}</span>
      ),
    },
    {
      key: "value",
      label: "Value",
      render: (_value, row) => (
        <span className="text-body font-medium text-[var(--admin-text-primary)]">
          {row.value}
        </span>
      ),
    },
    {
      key: "category_id",
      label: "Scoped Category",
      render: (_value, row) => (
        <span
          className={`text-body-sm ${
            row.category_id
              ? "text-[var(--admin-brand-primary)]"
              : "text-[var(--admin-grey)]"
          }`}
        >
          {getCategoryName(row.category_id)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="admin-icon-btn"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-dashboard-title text-[var(--admin-brand-secondary)]">
              {isLoading ? "Loading..." : attribute?.name}
            </h2>
            <p className="text-body-sm text-[var(--admin-grey)] mt-1">
              Manage values for this attribute
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="admin-btn-primary flex items-center gap-2"
          aria-label="Add new attribute value"
        >
          <Plus className="w-4 h-4" />
          Add Value
        </button>
      </div>

      {isLoading ? (
        <div className="admin-card p-8 text-center text-body-sm text-[var(--admin-grey)]">
          Loading values...
        </div>
      ) : (
        <DataTable
          data={attribute?.values ?? []}
          columns={columns}
        />
      )}

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Attribute Value"
        description={`Add a new value to the "${attribute?.name}" attribute`}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateValue}
              disabled={isCreating}
              className="admin-btn-primary"
            >
              {isCreating ? "Adding..." : "Add Value"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Value input */}
          <div className="space-y-2">
            <label
              htmlFor="attr-value"
              className="text-body font-medium text-[var(--admin-text-primary)]"
            >
              Value <span className="text-[var(--admin-error)]">*</span>
            </label>
            <input
              id="attr-value"
              type="text"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                if (valueError) setValueError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateValue();
              }}
              placeholder="e.g. Leather, Gold, Large"
              className="admin-input w-full"
              autoFocus
              aria-invalid={!!valueError}
              aria-describedby={valueError ? "attr-value-error" : undefined}
            />
            {valueError && (
              <p
                id="attr-value-error"
                className="text-body-sm text-[var(--admin-error)]"
                role="alert"
              >
                {valueError}
              </p>
            )}
          </div>

          {/* Category scope select */}
          <div className="space-y-2">
            <label
              htmlFor="attr-category"
              className="text-body font-medium text-[var(--admin-text-primary)]"
            >
              Scope to Category{" "}
              <span className="text-[var(--admin-grey)] font-normal">(optional)</span>
            </label>
            <select
              id="attr-category"
              value={selectedCategoryId ?? ""}
              onChange={(e) =>
                setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)
              }
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
    </div>
  );
}
