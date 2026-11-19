import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RatingStarsProps {
  rating: number;
  interactive?: boolean;
  onChange?: (next: number) => void;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({
  rating,
  interactive = false,
  onChange,
  size = "sm",
}: RatingStarsProps) {
  const iconClass =
    size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="inline-flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="inline-flex min-h-[44px] min-w-[40px] items-center justify-center rounded-lg hover:bg-[#ECFDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] cursor-pointer"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  iconClass,
                  filled
                    ? "fill-[#F59E0B] text-[#F59E0B]"
                    : "text-[#D1D5DB]"
                )}
              />
            </button>
          );
        }
        return (
          <Star
            key={star}
            className={cn(
              iconClass,
              filled ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#D1D5DB]"
            )}
          />
        );
      })}
    </div>
  );
}
