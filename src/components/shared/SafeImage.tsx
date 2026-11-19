import { useState } from "react";
import { Home } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className, fallbackLabel }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#D1FAE5] p-4 text-center text-[#047857]",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <Home className="h-7 w-7 opacity-80" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-[#065F46] line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={cn("object-cover", className)}
    />
  );
}
