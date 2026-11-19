import { Heart, MapPin, Star, Utensils, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { useTenant } from "@/src/context/TenantContext";
import { cn, formatINR } from "@/src/lib/utils";
import { PGProperty } from "@/src/types";

interface PGCardProps {
  pg: PGProperty;
  compact?: boolean;
  className?: string;
}

export function PGCard({ pg, compact = false, className }: PGCardProps) {
  const { savedPgIds, toggleSavedPg } = useTenant();
  const isSaved = savedPgIds.includes(pg.id);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1F5F9]">
        <Link to={`/pg/${pg.id}`} className="block h-full w-full">
          <SafeImage
            src={pg.images[0]}
            alt={`${pg.name} in ${pg.area}, ${pg.city}`}
            fallbackLabel={pg.name}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute left-3 top-3">
          {pg.availableBeds > 0 ? (
            <StatusBadge
              label={`${pg.availableBeds} bed${pg.availableBeds > 1 ? "s" : ""} available`}
              tone="success"
              className="shadow-xs"
            />
          ) : (
            <StatusBadge label="Currently Full" tone="neutral" className="shadow-xs" />
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleSavedPg(pg.id)}
          aria-label={isSaved ? `Remove ${pg.name} from saved` : `Save ${pg.name}`}
          className="absolute right-2.5 top-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-sm transition-transform active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isSaved ? "fill-[#EF4444] text-[#EF4444]" : "text-[#374151]"
            )}
          />
        </button>

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-xs font-semibold tracking-wide">
            {pg.genderType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs tabular-nums">
            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            {pg.rating.toFixed(1)}
            <span className="text-white/80 font-normal">({pg.reviewCount})</span>
          </span>
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col justify-between p-4", compact && "p-3.5")}>
        <div>
          <Link to={`/pg/${pg.id}`} className="block">
            <h3 className="font-display text-base font-bold text-[#111827] group-hover:text-[#047857] transition-colors line-clamp-1">
              {pg.name}
            </h3>
          </Link>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280] line-clamp-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#047857]" />
            <span className="truncate">
              {pg.area}, {pg.city}
            </span>
          </p>

          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#4B5563]">
              {pg.foodIncluded && (
                <span className="inline-flex items-center gap-1 text-[#047857]">
                  <Utensils className="h-3.5 w-3.5" />
                  Food Included
                </span>
              )}
              {pg.amenities.includes("wifi") && (
                <span className="inline-flex items-center gap-1">
                  <Wifi className="h-3.5 w-3.5 text-[#047857]" />
                  Wi-Fi
                </span>
              )}
              <span aria-hidden="true" className="text-[#D1D5DB]">
                ·
              </span>
              <span>
                {pg.rooms.map((r) => r.sharingType).filter((v, i, a) => a.indexOf(v) === i).join(" / ")}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F1F5F9] pt-3">
          <div>
            <p className="text-[11px] font-medium text-[#6B7280]">Starts from</p>
            <p className="font-display text-lg font-bold text-[#111827] tabular-nums">
              {formatINR(pg.startingRent)}
              <span className="text-xs font-normal text-[#6B7280]">/mo</span>
            </p>
          </div>
          <Button asChild size="sm" variant={pg.availableBeds > 0 ? "default" : "outline"}>
            <Link to={`/pg/${pg.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
