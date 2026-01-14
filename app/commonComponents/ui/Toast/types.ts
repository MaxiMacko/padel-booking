// components/ui/toast/types.ts
export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}
