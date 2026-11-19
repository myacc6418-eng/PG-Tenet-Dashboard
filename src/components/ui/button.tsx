import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#047857] text-white hover:bg-[#065F46] shadow-sm",
        secondary: "bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]",
        outline: "border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC]",
        ghost: "text-[#111827] hover:bg-[#F1F5F9]",
        destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
      },
      size: {
        default: "min-h-[44px] px-5 py-2.5",
        sm: "min-h-[40px] px-3.5 py-2 text-xs rounded-lg",
        lg: "min-h-[50px] px-6 py-3 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
