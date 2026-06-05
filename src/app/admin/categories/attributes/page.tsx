"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumn } from "@/components/admin/data-table/types";
import { AttributeFormModal, DeleteConfirmModal } from "@/components/admin/modals";
import {
  useGetAttributesQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  Attribute,
} from "@/state/attributes-api";

export default function AttributesPage() {
  const router = useRouter();
  const { data: attributes = [], isLoading } = useGetAttributesQuery();
  const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();
  const [deleteAttribute, { isLoading: isDeleting }] = useDeleteAttributeMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAttribute, setDeletingAttribute] = useState<Attribute | null>(null);

  const handleOpenEditModal = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (attribute: Attribute) => {
    setDeletingAttribute(attribute);
    setIsDeleteModalOpen(true);
  };

  const handleCreateAttribute = async (name: string) => {
    await createAttribute({ name }).unwrap();
    setIsCreateModalOpen(false);
  };

  const handleUpdateAttribute = async (name: string) => {
    if (!editingAttribute) return;
    await updateAttribute({ attributeId: editingAttribute.id, attribute: { name } }).unwrap();
    setIsEditModalOpen(false);
    setEditingAttribute(null);
  };

  const handleDeleteAttribute = async () => {
    if (!deletingAttribute) return;
    try {
      await deleteAttribute(deletingAttribute.id).unwrap();
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingAttribute(null);
    }
  };

  const columns: DataTableColumn<Attribute>[] = [
    {
      key: "index",
      label: "No.",
      width: "60px",
      render: (_value, _row, index) => (
        <span className="text-body-sm text-[var(--admin-grey)]">{index + 1}</span>
      ),
    },
    {
      key: "name",
      label: "Attribute Name",
      render: (_value, row) => (
        <span className="text-body font-medium text-[var(--admin-text-primary)]">
          {row.name}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      width: "160px",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/categories/attributes/${row.id}`);
            }}
            className="admin-icon-btn text-[var(--admin-brand-primary)]"
            aria-label={`View ${row.name} values`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(row);
            }}
            className="admin-icon-btn"
            aria-label={`Edit ${row.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDeleteModal(row);
            }}
            className="admin-icon-btn text-[var(--admin-error)]"
            aria-label={`Delete ${row.name}`}
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
        <div>
          <h2 className="text-dashboard-title text-[var(--admin-brand-secondary)]">
            Attributes
          </h2>
          <p className="text-body-sm text-[var(--admin-grey)] mt-1">
            Manage filterable product attributes (e.g. Material, Color)
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="admin-btn-primary flex items-center gap-2"
          aria-label="Add new attribute"
        >
          <Plus className="w-4 h-4" />
          Add Attribute
        </button>
      </div>

      {isLoading ? (
        <div className="admin-card p-8 text-center text-body-sm text-[var(--admin-grey)]">
          Loading attributes...
        </div>
      ) : (
        <DataTable data={attributes} columns={columns} />
      )}

      <AttributeFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateAttribute}
        isLoading={isCreating}
        mode="create"
      />

      <AttributeFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setEditingAttribute(null);
        }}
        onSubmit={handleUpdateAttribute}
        initialName={editingAttribute?.name ?? ""}
        isLoading={isUpdating}
        mode="edit"
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setDeletingAttribute(null);
        }}
        title="Delete Attribute"
        description={`Are you sure you want to delete "${deletingAttribute?.name}"? This will also delete all its values and cannot be undone.`}
        body="All values associated with this attribute will also be permanently removed."
        confirmLabel="Delete Attribute"
        isLoading={isDeleting}
        onConfirm={handleDeleteAttribute}
      />
    </div>
  );
}
