import {
  Car,
  Dumbbell,
  Flame,
  GlassWater,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tv,
  Utensils,
  WashingMachine,
  Wifi,
  Zap,
} from "lucide-react";
import { AMENITY_META } from "@/src/data/mockData";
import { AmenityKey } from "@/src/types";
import { cn } from "@/src/lib/utils";

const ICONS: Record<AmenityKey, typeof Wifi> = {
  wifi: Wifi,
  food: Utensils,
  ac: Snowflake,
  laundry: WashingMachine,
  housekeeping: Sparkles,
  cctv: ShieldCheck,
  power_backup: Zap,
  water_purifier: GlassWater,
  gym: Dumbbell,
  common_area: Tv,
  parking: Car,
  hot_water: Flame,
};

interface AmenityChipProps {
  amenity: AmenityKey;
  compact?: boolean;
  className?: string;
}

export function AmenityChip({ amenity, compact = false, className }: AmenityChipProps) {
  const Icon = ICONS[amenity] || Wifi;
  const meta = AMENITY_META[amenity];

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium text-[#374151]",
          className
        )}
      >
        <Icon className="h-3.5 w-3.5 text-[#047857] shrink-0" />
        <span>{meta.short}</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5",
        className
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium text-[#111827]">{meta.label}</span>
    </div>
  );
}
