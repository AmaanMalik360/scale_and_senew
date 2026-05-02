"use client";

import { ReactNode, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
        />
        <Dialog.Content
          className={`fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full ${sizeClasses[size]} max-h-[85vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) {
              e.preventDefault();
            }
          }}
        >
          {/* <div className="admin-card flex flex-col max-h-[85vh]"></div> */}
          <div className="admin-panel flex flex-col max-h-[85vh] bg-[var(--admin-bg-white)] rounded-[var(--admin-radius-lg)] shadow-[var(--admin-shadow-1)] border border-[var(--admin-border-light)]">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-[var(--admin-border)]">
              <div className="flex-1">
                <Dialog.Title className="text-title-lg text-[var(--admin-brand-secondary)] font-medium">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="text-body-sm text-[var(--admin-grey)] mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close className="ml-4 text-[var(--admin-grey)] hover:text-[var(--admin-text-primary)] transition-colors">
                  <X className="w-5 h-5" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--admin-border)]">
                {footer}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
