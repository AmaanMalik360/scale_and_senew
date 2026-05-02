"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumn } from "@/components/admin/data-table/types";
import { Modal } from "@/components/admin/modals/Modal";
import {
  useGetAttributesQuery,
  useCreateAttributeMutation,
  Attribute,
} from "@/state/attributes-api";

export default function AttributesPage() {
  const router = useRouter();
  const { data: attributes = [], isLoading } = useGetAttributesQuery();
  const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleOpenModal = () => {
    setNewAttributeName("");
    setNameError("");
    setIsModalOpen(true);
  };

  const handleCreateAttribute = async () => {
    if (!newAttributeName.trim()) {
      setNameError("Attribute name is required");
      return;
    }
    try {
      await createAttribute({ name: newAttributeName.trim() }).unwrap();
      setIsModalOpen(false);
      setNewAttributeName("");
      setNameError("");
    } catch (error: any) {
      setNameError(error?.data?.detail || "Failed to create attribute");
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
      width: "120px",
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
          onClick={handleOpenModal}
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
        <DataTable
          data={attributes}
          columns={columns}
        />
      )}

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add New Attribute"
        description="Create a new attribute dimension (e.g. Material, Color, Size)"
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
              onClick={handleCreateAttribute}
              disabled={isCreating}
              className="admin-btn-primary"
            >
              {isCreating ? "Creating..." : "Create Attribute"}
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <label
            htmlFor="attribute-name"
            className="text-body font-medium text-[var(--admin-text-primary)]"
          >
            Attribute Name <span className="text-[var(--admin-error)]">*</span>
          </label>
          <input
            id="attribute-name"
            type="text"
            value={newAttributeName}
            onChange={(e) => {
              setNewAttributeName(e.target.value);
              if (nameError) setNameError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateAttribute();
            }}
            placeholder="e.g. Material, Color, Size"
            className="admin-input w-full"
            autoFocus
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "attribute-name-error" : undefined}
          />
          {nameError && (
            <p
              id="attribute-name-error"
              className="text-body-sm text-[var(--admin-error)]"
              role="alert"
            >
              {nameError}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
