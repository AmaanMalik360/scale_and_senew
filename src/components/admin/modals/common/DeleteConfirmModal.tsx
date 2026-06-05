"use client";

import { Modal } from "../Modal";

export interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  body?: string;
  isLoading?: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  body,
  isLoading = false,
  confirmLabel = "Delete",
  onConfirm,
}: DeleteConfirmModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    title={title}
    description={description}
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
          onClick={onConfirm}
          disabled={isLoading}
          className="admin-btn-primary bg-[var(--admin-error)] hover:bg-[var(--admin-error)]"
        >
          {isLoading ? "Deleting..." : confirmLabel}
        </button>
      </>
    }
  >
    {body && (
      <p className="text-body-sm text-[var(--admin-grey)]">{body}</p>
    )}
  </Modal>
);
