import { ArrowLeft, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/src/context/TenantContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  audioText?: string;
  rightSlot?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  audioText,
  rightSlot,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { speakGuidance, audioGuidanceEnabled, t } = useTenant();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#111827] hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-base font-bold text-[#111827] sm:text-lg">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-xs text-[#6B7280]">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(audioGuidanceEnabled || audioText) && (
            <button
              type="button"
              onClick={() => speakGuidance(audioText || `${title}. ${subtitle || ""}`)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#ECFDF5] px-3 text-xs font-semibold text-[#047857] hover:bg-[#D1FAE5] cursor-pointer"
              aria-label={t.audioGuideLabel}
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.audioGuideLabel}</span>
            </button>
          )}
          {rightSlot}
        </div>
      </div>
    </div>
  );
}
