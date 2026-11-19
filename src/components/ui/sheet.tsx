import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface MobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function MobileSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: MobileSheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 flex max-h-[88vh] flex-col rounded-t-3xl border-t border-[#E5E7EB] bg-white shadow-2xl focus:outline-none md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:border"
          )}
        >
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-[#D1D5DB] md:hidden" />
          <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <DialogPrimitive.Title className="font-display text-lg font-bold text-[#111827]">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-0.5 text-sm text-[#6B7280]">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {footer && (
            <div className="border-t border-[#E5E7EB] bg-white px-5 py-4 pb-safe">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
