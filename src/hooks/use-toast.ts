import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToasterToast = {
  id: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
};

type Toast = Omit<ToasterToast, "id">;

function toast({ title, description, action, variant, duration, ...props }: Toast) {
  let toastId: string | number;

  const options = {
    duration: duration,
    description: description,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
    ...props,
  };

  switch (variant) {
    case "success":
      toastId = sonnerToast.success(title, options);
      break;
    case "error":
      toastId = sonnerToast.error(title, options);
      break;
    case "warning":
      toastId = sonnerToast.warning(title, options);
      break;
    case "info":
      toastId = sonnerToast.info(title, options);
      break;
    default:
      toastId = sonnerToast(title, options);
  }

  return {
    id: toastId,
    dismiss: () => sonnerToast.dismiss(toastId),
    update: (props: Partial<ToasterToast>) => {
      // Sonner doesn't support updating toasts directly
      // So we dismiss the old one and create a new one
      sonnerToast.dismiss(toastId);
      return toast({ title, description, action, variant, duration, ...props });
    },
  };
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
}

export { useToast, toast };