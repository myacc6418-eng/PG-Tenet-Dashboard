import { Home } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandMark({ size = "md", className }: BrandMarkProps) {
  const iconBox =
    size === "lg"
      ? "h-14 w-14 rounded-2xl"
      : size === "sm"
      ? "h-8 w-8 rounded-lg"
      : "h-9 w-9 rounded-xl";
  const iconSize = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className={cn("inline-flex items-center gap-2.5 shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center bg-[#047857] text-white shadow-sm",
          iconBox
        )}
      >
        <Home className={iconSize} strokeWidth={2.2} />
      </span>
      <span
        className={cn(
          "font-display font-bold tracking-tight text-[#111827] whitespace-nowrap",
          textSize
        )}
      >
        PG Finder
      </span>
    </div>
  );
}
