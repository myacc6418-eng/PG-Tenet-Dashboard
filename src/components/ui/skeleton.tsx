import { cn } from "@/src/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-[#E5E7EB]/70", className)}
    />
  );
}
