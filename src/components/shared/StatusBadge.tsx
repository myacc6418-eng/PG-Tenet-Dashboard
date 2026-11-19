import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  XCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export type StatusTone = "success" | "warning" | "error" | "neutral" | "info";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

const TONE_MAP: Record<
  StatusTone,
  { text: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    text: "text-[#065F46]",
    bg: "bg-[#ECFDF5]",
    Icon: CheckCircle2,
  },
  warning: {
    text: "text-[#92400E]",
    bg: "bg-[#FEF3C7]",
    Icon: Clock,
  },
  error: {
    text: "text-[#991B1B]",
    bg: "bg-[#FEE2E2]",
    Icon: XCircle,
  },
  info: {
    text: "text-[#047857]",
    bg: "bg-[#ECFDF5]",
    Icon: Info,
  },
  neutral: {
    text: "text-[#374151]",
    bg: "bg-[#F1F5F9]",
    Icon: AlertCircle,
  },
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  const { text, bg, Icon } = TONE_MAP[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0",
        bg,
        text,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
