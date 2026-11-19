import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  List,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PGCard } from "@/src/components/shared/PGCard";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Switch } from "@/src/components/ui/switch";
import { useTenant } from "@/src/context/TenantContext";
import { formatINR } from "@/src/lib/utils";
import { PGFilterParams, pgService } from "@/src/services/pgService";
import { PGGenderType, SharingType } from "@/src/types";

const CITIES = ["All", "Hyderabad", "Bengaluru", "Pune"] as const;
const AREAS_BY_CITY: Record<string, string[]> = {
  All: ["Madhapur", "Gachibowli", "Kondapur", "HITEC City", "Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Kothrud"],
  Hyderabad: ["Madhapur", "Gachibowli", "Kondapur", "HITEC City"],
  Bengaluru: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield"],
  Pune: ["Kothrud"],
};

export function ExploreScreen() {
  const { t } = useTenant();
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || "All";
  const initialQ = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQ);
  const [city, setCity] = useState<string>(initialCity);
  const [area, setArea] = useState<string>("All");
  const [maxRent, setMaxRent] = useState<number>(18000);
  const [genderType, setGenderType] = useState<PGGenderType | "All">("All");
  const [sharingTypes, setSharingTypes] = useState<SharingType[]>([]);
  const [acOnly, setAcOnly] = useState<boolean | null>(null);
  const [foodIncluded, setFoodIncluded] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<PGFilterParams["sortBy"]>("recommended");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMapPgId, setSelectedMapPgId] = useState<string>("pg-green-nest");

  const filterParams: PGFilterParams = useMemo(
    () => ({
      search,
      city,
      area,
      maxRent,
      genderType,
      sharingTypes,
      acOnly,
      foodIncluded,
      amenities,
      availableOnly,
      minRating,
      sortBy,
    }),
    [
      search,
      city,
      area,
      maxRent,
      genderType,
      sharingTypes,
      acOnly,
      foodIncluded,
      amenities,
      availableOnly,
      minRating,
      sortBy,
    ]
  );

  const { data: pgs = [], isLoading } = useQuery({
    queryKey: ["pgs", filterParams],
    queryFn: () => pgService.listPGs(filterParams),
  });

  const activeFilterCount =
    (city !== "All" ? 1 : 0) +
    (area !== "All" ? 1 : 0) +
    (maxRent < 18000 ? 1 : 0) +
    (genderType !== "All" ? 1 : 0) +
    sharingTypes.length +
    (acOnly !== null ? 1 : 0) +
    (foodIncluded ? 1 : 0) +
    amenities.length +
    (availableOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const clearAllFilters = () => {
    setSearch("");
    setCity("All");
    setArea("All");
    setMaxRent(18000);
    setGenderType("All");
    setSharingTypes([]);
    setAcOnly(null);
    setFoodIncluded(false);
    setAmenities([]);
    setAvailableOnly(false);
    setMinRating(0);
    setSortBy("recommended");
  };

  const toggleSharing = (s: SharingType) => {
    setSharingTypes((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleAmenity = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const selectedMapPg = pgs.find((p) => p.id === selectedMapPgId) || pgs[0];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5 pb-8 sm:px-6 lg:pt-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            {t.findPerfectPg}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {pgs.length} verified accommodation{pgs.length === 1 ? "" : "s"} available to browse
          </p>
        </div>

        {/* Location & Map/List toggle */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Select city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setArea("All");
            }}
            className="min-h-[44px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm font-semibold text-[#111827] focus:border-[#047857] focus:outline-none cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Cities" : c}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-xl border border-[#E5E7EB] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#047857] text-white"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold cursor-pointer ${
                viewMode === "map"
                  ? "bg-[#047857] text-white"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <MapIcon className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filter + Sort Row */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by PG name, area (Madhapur, Koramangala...)"
            className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] shadow-2xs focus:border-[#047857] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant={activeFilterCount > 0 ? "secondary" : "outline"}
            onClick={() => setFilterOpen(true)}
            className="flex-1 sm:flex-initial"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>

          <select
            aria-label="Sort PGs"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as PGFilterParams["sortBy"])}
            className="min-h-[44px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm font-medium text-[#111827] focus:border-[#047857] focus:outline-none cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="rent_low">Rent: Low to High</option>
            <option value="rent_high">Rent: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Quick Gender & Availability Filter Tabs */}
      <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        {(["All", "Boys PG", "Girls PG", "Co-living"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGenderType(g)}
            className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer ${
              genderType === g
                ? "bg-[#047857] text-white"
                : "border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#047857]"
            }`}
          >
            {g === "All" ? "All PGs" : g}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setAvailableOnly((v) => !v)}
          className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer ${
            availableOnly
              ? "bg-[#047857] text-white"
              : "border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#047857]"
          }`}
        >
          Available Rooms Only
        </button>

        <button
          type="button"
          onClick={() => setFoodIncluded((v) => !v)}
          className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer ${
            foodIncluded
              ? "bg-[#047857] text-white"
              : "border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#047857]"
          }`}
        >
          Food Included
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3"
              >
                <Skeleton className="aspect-[16/10] w-full" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : pgs.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No PGs match your filters"
            description="Try widening your rent budget or clearing a few room filters to see more verified stays."
            actionLabel="Clear All Filters"
            onAction={clearAllFilters}
          />
        ) : viewMode === "map" ? (
          <div className="grid gap-5 lg:grid-cols-12">
            {/* Interactive Neighborhood Map Canvas */}
            <div className="relative h-[420px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#ECFDF5] lg:col-span-7 lg:h-[520px]">
              {/* Subtle Street Grid Pattern */}
              <svg
                className="absolute inset-0 h-full w-full opacity-45"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="pg-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path
                      d="M 48 0 L 0 0 0 48"
                      fill="none"
                      stroke="#A7F3D0"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pg-grid)" />
                <path
                  d="M 0 180 Q 220 140 520 260 T 900 180"
                  fill="none"
                  stroke="#6EE7B7"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 160 0 Q 240 240 200 540"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                />
              </svg>

              <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-[#111827] shadow-xs">
                Tap a price marker to preview PG
              </div>

              {pgs.map((pg) => {
                const isSelected = selectedMapPg?.id === pg.id;
                return (
                  <button
                    key={pg.id}
                    type="button"
                    onClick={() => setSelectedMapPgId(pg.id)}
                    style={{
                      left: `${pg.mapPosition.x}%`,
                      top: `${pg.mapPosition.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-bold shadow-md transition-transform cursor-pointer tabular-nums ${
                      isSelected
                        ? "z-20 scale-110 bg-[#047857] text-white ring-4 ring-white"
                        : "z-10 bg-white text-[#111827] hover:scale-105 hover:bg-[#ECFDF5]"
                    }`}
                  >
                    {formatINR(pg.startingRent)}
                  </button>
                );
              })}
            </div>

            {/* Selected Map PG Preview */}
            <div className="lg:col-span-5">
              {selectedMapPg && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#F1F5F9]">
                    <SafeImage
                      src={selectedMapPg.images[0]}
                      alt={selectedMapPg.name}
                      fallbackLabel={selectedMapPg.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#047857]">
                        {selectedMapPg.genderType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#111827]">
                        <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        {selectedMapPg.rating} ({selectedMapPg.reviewCount})
                      </span>
                    </div>
                    <h2 className="mt-1 font-display text-xl font-bold text-[#111827]">
                      {selectedMapPg.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {selectedMapPg.address}
                    </p>
                    <p className="mt-3 text-sm font-medium text-[#374151]">
                      {selectedMapPg.availableBeds > 0
                        ? `${selectedMapPg.availableRooms} rooms / ${selectedMapPg.availableBeds} beds available`
                        : "Currently full — join waitlist or schedule visit"}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                      <div>
                        <p className="text-xs text-[#6B7280]">Starting from</p>
                        <p className="font-display text-xl font-extrabold text-[#111827] tabular-nums">
                          {formatINR(selectedMapPg.startingRent)}
                          <span className="text-xs font-normal text-[#6B7280]">/mo</span>
                        </p>
                      </div>
                      <Button asChild>
                        <Link to={`/pg/${selectedMapPg.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pgs.map((pg) => (
              <PGCard key={pg.id} pg={pg} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet / Modal */}
      <MobileSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Filter PGs"
        description="Narrow down rooms by city, budget, sharing, and facilities"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setFilterOpen(false)}>
              Show {pgs.length} PGs
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Area */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#111827]">
              Area / Locality
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827]"
            >
              <option value="All">All Areas</option>
              {(AREAS_BY_CITY[city] || AREAS_BY_CITY.All).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Max Monthly Rent */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-[#111827]">
                Max Monthly Rent
              </label>
              <span className="font-mono text-sm font-bold text-[#047857] tabular-nums">
                Up to {formatINR(maxRent)}
              </span>
            </div>
            <input
              type="range"
              min={6500}
              max={18000}
              step={500}
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              className="w-full accent-[#047857]"
            />
            <div className="mt-1 flex justify-between text-xs text-[#6B7280] tabular-nums">
              <span>₹6,500</span>
              <span>₹12,000</span>
              <span>₹18,000+</span>
            </div>
          </div>

          {/* Sharing Types */}
          <div>
            <p className="mb-2 text-sm font-bold text-[#111827]">Sharing Type</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["Single", "Double", "Triple", "Four"] as const).map((s) => {
                const active = sharingTypes.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSharing(s)}
                    className={`min-h-[44px] rounded-xl border text-xs font-semibold cursor-pointer ${
                      active
                        ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                        : "border-[#E5E7EB] bg-white text-[#374151]"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AC / Non-AC */}
          <div>
            <p className="mb-2 text-sm font-bold text-[#111827]">Room Cooling</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Any", val: null },
                { label: "AC Rooms", val: true },
                { label: "Non-AC", val: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAcOnly(opt.val)}
                  className={`min-h-[44px] rounded-xl border text-xs font-semibold cursor-pointer ${
                    acOnly === opt.val
                      ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                      : "border-[#E5E7EB] bg-white text-[#374151]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="mb-2 text-sm font-bold text-[#111827]">Essential Amenities</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "wifi", label: "Wi-Fi" },
                { key: "laundry", label: "Laundry" },
                { key: "parking", label: "Parking" },
                { key: "cctv", label: "24/7 Security" },
              ].map((item) => {
                const active = amenities.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleAmenity(item.key)}
                    className={`min-h-[44px] rounded-xl border px-3 text-left text-xs font-semibold cursor-pointer ${
                      active
                        ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                        : "border-[#E5E7EB] bg-white text-[#374151]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating & Toggles */}
          <div className="space-y-3 border-t border-[#E5E7EB] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#111827]">
                Food Included Only
              </span>
              <Switch checked={foodIncluded} onCheckedChange={setFoodIncluded} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#111827]">
                Available Beds Only
              </span>
              <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#111827]">
                Minimum Rating 4.5★
              </span>
              <Switch
                checked={minRating >= 4.5}
                onCheckedChange={(v) => setMinRating(v ? 4.5 : 0)}
              />
            </div>
          </div>
        </div>
      </MobileSheet>
    </div>
  );
}
