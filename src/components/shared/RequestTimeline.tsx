import { Check, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface TimelineStep {
  title: string;
  subtitle?: string;
  state: "done" | "current" | "upcoming" | "warning";
}

export function RequestTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-3.5">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[15px] top-8 bottom-[-18px] w-0.5",
                  step.state === "done" ? "bg-[#047857]" : "bg-[#E5E7EB]"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                step.state === "done" &&
                  "border-[#047857] bg-[#047857] text-white",
                step.state === "current" &&
                  "border-[#047857] bg-[#ECFDF5] text-[#047857] ring-4 ring-[#ECFDF5]",
                step.state === "warning" &&
                  "border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]",
                step.state === "upcoming" &&
                  "border-[#E5E7EB] bg-white text-[#9CA3AF]"
              )}
            >
              {step.state === "done" ? (
                <Check className="h-4 w-4" />
              ) : step.state === "warning" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : step.state === "current" ? (
                <Clock className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </span>

            <div className="pt-0.5 pb-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.state === "upcoming" ? "text-[#6B7280]" : "text-[#111827]"
                )}
              >
                {step.title}
              </p>
              {step.subtitle && (
                <p className="mt-0.5 text-xs text-[#6B7280] leading-relaxed">
                  {step.subtitle}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
