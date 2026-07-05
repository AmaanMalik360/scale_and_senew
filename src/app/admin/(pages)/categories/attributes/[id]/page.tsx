"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumn } from "@/components/admin/data-table/types";
import { AttributeValueFormModal, AttributeValueFormData, DeleteConfirmModal } from "@/components/admin/modals";
import { useGetCategoriesQuery } from "@/state/categories-api";
import { useGetAttributeQuery } from "@/state/attributes-api";
import {
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueMutation,
  AttributeValue,
} from "@/state/attribute-values-api";

export default function AttributeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attributeId = Number(params.id);

  const { data: attribute, isLoading } = useGetAttributeQuery(attributeId);
  const { data: categories = [] } = useGetCategoriesQuery({});
  const [createAttributeValue, { isLoading: isCreating }] = useCreateAttributeValueMutation();
  const [updateAttributeValue, { isLoading: isUpdating }] = useUpdateAttributeValueMutation();
  const [deleteAttributeValue, { isLoading: isDeleting }] = useDeleteAttributeValueMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<AttributeValue | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingValue, setDeletingValue] = useState<AttributeValue | null>(null);

  const handleCreateValue = async (data: AttributeValueFormData) => {
    await createAttributeValue({ attributeId, value: data }).unwrap();
    setIsCreateModalOpen(false);
  };

  const handleUpdateValue = async (data: AttributeValueFormData) => {
    if (!editingValue) return;
    await updateAttributeValue({ valueId: editingValue.id, attributeId, value: data }).unwrap();
    setIsEditModalOpen(false);
    setEditingValue(null);
  };

  const handleDeleteValue = async () => {
    if (!deletingValue) return;
    try {
      await deleteAttributeValue({ valueId: deletingValue.id, attributeId }).unwrap();
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingValue(null);
    }
  };

  const handleOpenEditModal = (attrValue: AttributeValue) => {
    setEditingValue(attrValue);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (attrValue: AttributeValue) => {
    setDeletingValue(attrValue);
    setIsDeleteModalOpen(true);
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
    {
      key: "actions",
      label: "Action",
      width: "100px",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(row);
            }}
            className="admin-icon-btn"
            aria-label={`Edit value ${row.value}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDeleteModal(row);
            }}
            className="admin-icon-btn text-[var(--admin-error)]"
            aria-label={`Delete value ${row.value}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
          onClick={() => setIsCreateModalOpen(true)}
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
        <DataTable data={attribute?.values ?? []} columns={columns} />
      )}

      <AttributeValueFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateValue}
        attributeName={attribute?.name}
        flatCategories={flatCategories}
        isLoading={isCreating}
        mode="create"
      />

      <AttributeValueFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setEditingValue(null);
        }}
        onSubmit={handleUpdateValue}
        attributeName={attribute?.name}
        initialData={
          editingValue
            ? { value: editingValue.value, category_id: editingValue.category_id ?? null }
            : undefined
        }
        flatCategories={flatCategories}
        isLoading={isUpdating}
        mode="edit"
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setDeletingValue(null);
        }}
        title="Delete Attribute Value"
        description={`Are you sure you want to delete the value "${deletingValue?.value}"? This cannot be undone.`}
        body="Removing this value may affect products that currently use it as a filter option."
        confirmLabel="Delete Value"
        isLoading={isDeleting}
        onConfirm={handleDeleteValue}
      />
    </div>
  );
}
