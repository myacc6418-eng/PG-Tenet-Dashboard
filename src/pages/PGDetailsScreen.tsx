import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Phone,
  QrCode,
  Share2,
  Star,
  Utensils,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AmenityChip } from "@/src/components/shared/AmenityChip";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { RatingStars } from "@/src/components/shared/RatingStars";
import { RoomCard } from "@/src/components/shared/RoomCard";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useTenant } from "@/src/context/TenantContext";
import { cn, formatINR } from "@/src/lib/utils";
import { pgService } from "@/src/services/pgService";

const TABS = [
  "Overview",
  "Rooms",
  "Amenities",
  "Food",
  "Reviews",
  "Location",
] as const;

type DetailTab = (typeof TABS)[number];

export function PGDetailsScreen() {
  const { pgId } = useParams<{ pgId: string }>();
  const navigate = useNavigate();
  const { savedPgIds, toggleSavedPg, scheduleVisit, submittedReviews, t } = useTenant();

  const { data: pg, isLoading } = useQuery({
    queryKey: ["pg", pgId],
    queryFn: () => pgService.getPGById(pgId || ""),
    enabled: Boolean(pgId),
  });

  const [imgIndex, setImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");
  const [selectedDayIdx, setSelectedDayIdx] = useState(2); // Wednesday default
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitDate, setVisitDate] = useState("2026-11-22");
  const [visitSlot, setVisitSlot] = useState("11:00 AM – 11:30 AM");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <EmptyState
          icon={MapPin}
          title="PG not found"
          description="This accommodation listing is no longer available."
          actionLabel="Explore PGs"
          actionTo="/explore"
        />
      </div>
    );
  }

  const isSaved = savedPgIds.includes(pg.id);
  const hasAvailability = pg.availableBeds > 0;
  const allReviews = [
    ...submittedReviews.filter((r) => r.pgId === pg.id),
    ...pg.reviews,
  ];
  const dayMenu = pg.weeklyMenu[selectedDayIdx] || pg.weeklyMenu[0];

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: pg.name, url: shareUrl });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(shareUrl);
    toast.success("PG link copied to clipboard");
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleVisit(pg.id, visitDate, visitSlot);
    setVisitOpen(false);
  };

  return (
    <div className="pb-24 lg:pb-12">
      {/* Top Hero Image Gallery */}
      <div className="relative mx-auto max-w-6xl lg:px-6 lg:pt-6">
        <div className="relative aspect-[16/10] max-h-[420px] w-full overflow-hidden bg-[#111827] lg:rounded-3xl">
          <SafeImage
            src={pg.images[imgIndex] || pg.images[0]}
            alt={`${pg.name} photo ${imgIndex + 1}`}
            fallbackLabel={pg.name}
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

          {/* Top Floating Actions */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-md hover:bg-white cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share PG"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-md hover:bg-white cursor-pointer"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => toggleSavedPg(pg.id)}
                aria-label={isSaved ? "Remove from saved" : "Save PG"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-md hover:bg-white cursor-pointer"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isSaved ? "fill-[#EF4444] text-[#EF4444]" : "text-[#111827]"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Gallery Arrows */}
          {pg.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setImgIndex((i) => (i === 0 ? pg.images.length - 1 : i - 1))
                }
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i + 1) % pg.images.length)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Bottom Image Counter & Thumbnails */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold backdrop-blur-xs">
              {pg.genderType}
            </span>
            <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold backdrop-blur-xs tabular-nums">
              {imgIndex + 1} / {pg.images.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid (Responsive 2-column on Desktop) */}
      <div className="mx-auto mt-5 max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          {/* Property Header */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#047857]">
                  <span>{pg.genderType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{pg.foodIncluded ? "Food Included" : "Self-Cook"}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {hasAvailability
                      ? `${pg.availableRooms} rooms / ${pg.availableBeds} beds available`
                      : "Currently Full"}
                  </span>
                </div>
                <h1 className="mt-1.5 font-display text-2xl font-extrabold text-[#111827] sm:text-3xl">
                  {pg.name}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#047857]" />
                  <span>
                    {pg.area}, {pg.city}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#ECFDF5] px-3 py-1.5 text-sm font-bold text-[#065F46] tabular-nums">
                  <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  {pg.rating.toFixed(1)} / 5
                  <span className="font-normal text-[#047857]">
                    ({pg.reviewCount} reviews)
                  </span>
                </div>
                <p className="mt-2 font-display text-xl font-extrabold text-[#111827] tabular-nums lg:hidden">
                  {formatINR(pg.startingRent)}
                  <span className="text-xs font-normal text-[#6B7280]">
                    /month onwards
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 6 Section Navigation Tabs */}
          <div className="no-scrollbar mt-5 flex gap-1.5 overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white p-1.5">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "min-h-[42px] shrink-0 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-colors cursor-pointer",
                    active
                      ? "bg-[#047857] text-white"
                      : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Tab Panels */}
          <div className="mt-5 space-y-5">
            {activeTab === "Overview" && (
              <>
                <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <h2 className="font-display text-lg font-bold text-[#111827]">
                    About {pg.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    {pg.description}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#F1F5F9] pt-4 text-center sm:text-left">
                    <div>
                      <p className="text-xs text-[#6B7280]">Total Rooms</p>
                      <p className="font-display text-lg font-bold text-[#111827] tabular-nums">
                        {pg.totalRooms}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Total Beds</p>
                      <p className="font-display text-lg font-bold text-[#111827] tabular-nums">
                        {pg.totalBeds}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Occupancy</p>
                      <p className="font-display text-lg font-bold text-[#047857] tabular-nums">
                        {pg.currentOccupancy} / {pg.totalBeds}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <h2 className="font-display text-lg font-bold text-[#111827]">
                    Property Rules & Check-in Conditions
                  </h2>
                  <ul className="mt-3 space-y-2.5">
                    {pg.rules.map((rule) => (
                      <li
                        key={rule}
                        className="flex items-start gap-2.5 text-sm text-[#374151]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border-t border-[#F1F5F9] pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Check-in Requirements
                    </p>
                    <ul className="mt-2 space-y-2">
                      {pg.checkInConditions.map((cond) => (
                        <li key={cond} className="text-sm text-[#4B5563]">
                          • {cond}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <h2 className="font-display text-lg font-bold text-[#111827]">
                    Owner & Caretaker Contact
                  </h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
                      <div>
                        <p className="text-xs text-[#6B7280]">Property Owner</p>
                        <p className="text-sm font-bold text-[#111827]">{pg.ownerName}</p>
                        <p className="text-xs text-[#4B5563] tabular-nums">{pg.ownerPhone}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => toast.info(`Calling ${pg.ownerName}: ${pg.ownerPhone}`)}
                        aria-label="Call owner"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
                      <div>
                        <p className="text-xs text-[#6B7280]">On-site Caretaker</p>
                        <p className="text-sm font-bold text-[#111827]">{pg.caretakerName}</p>
                        <p className="text-xs text-[#4B5563] tabular-nums">{pg.caretakerPhone}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => toast.info(`Calling ${pg.caretakerName}: ${pg.caretakerPhone}`)}
                        aria-label="Call caretaker"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "Rooms" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-[#111827]">
                    Available Room Options
                  </h2>
                  <span className="text-xs font-medium text-[#6B7280]">
                    Food & Wi-Fi included
                  </span>
                </div>
                {pg.rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}

            {activeTab === "Amenities" && (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="font-display text-lg font-bold text-[#111827]">
                  Facilities & Amenities
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  All listed amenities are maintained by on-site PG staff.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {pg.amenities.map((amenity) => (
                    <AmenityChip key={amenity} amenity={amenity} />
                  ))}
                </div>
              </section>
            )}

            {activeTab === "Food" && (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#111827]">
                      Weekly Food Menu
                    </h2>
                    <p className="text-sm text-[#6B7280]">
                      Homestyle freshly cooked meals included in monthly rent
                    </p>
                  </div>
                  <StatusBadge label="Veg & Optional Non-Veg" tone="success" />
                </div>

                <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
                  {pg.weeklyMenu.map((d, idx) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setSelectedDayIdx(idx)}
                      className={`min-h-[40px] shrink-0 rounded-xl px-3.5 text-xs font-semibold cursor-pointer ${
                        selectedDayIdx === idx
                          ? "bg-[#047857] text-white"
                          : "border border-[#E5E7EB] bg-[#F8FAFC] text-[#374151]"
                      }`}
                    >
                      {d.day}
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { type: "Breakfast", slot: dayMenu.breakfast },
                    { type: "Lunch", slot: dayMenu.lunch },
                    { type: "Dinner", slot: dayMenu.dinner },
                  ].map(({ type, slot }) => (
                    <div
                      key={type}
                      className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]"
                    >
                      {slot.image && (
                        <SafeImage
                          src={slot.image}
                          alt={slot.title}
                          className="aspect-[16/10] w-full"
                        />
                      )}
                      <div className="p-3.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#047857]">
                          <span className="inline-flex items-center gap-1">
                            <Utensils className="h-3.5 w-3.5" />
                            {type}
                          </span>
                          <span className="text-[#6B7280] font-normal">{slot.time}</span>
                        </div>
                        <h3 className="mt-1.5 text-sm font-bold text-[#111827]">
                          {slot.title}
                        </h3>
                        <ul className="mt-2 space-y-1 text-xs text-[#4B5563]">
                          {slot.items.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                        {slot.nonVegOption && (
                          <p className="mt-2 text-[11px] font-medium text-[#92400E]">
                            Optional: {slot.nonVegOption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "Reviews" && (
              <section className="space-y-4">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <div className="grid gap-6 sm:grid-cols-12 sm:items-center">
                    <div className="sm:col-span-4">
                      <p className="font-display text-4xl font-extrabold text-[#111827] tabular-nums">
                        {pg.rating.toFixed(1)}
                      </p>
                      <RatingStars rating={pg.rating} size="md" />
                      <p className="mt-1.5 text-xs text-[#6B7280]">
                        Based on {pg.reviewCount} verified tenant stays
                      </p>
                    </div>
                    <div className="space-y-2 sm:col-span-8">
                      {[
                        { stars: 5, pct: 74 },
                        { stars: 4, pct: 18 },
                        { stars: 3, pct: 5 },
                        { stars: 2, pct: 2 },
                        { stars: 1, pct: 1 },
                      ].map((row) => (
                        <div key={row.stars} className="flex items-center gap-3 text-xs">
                          <span className="w-8 font-semibold text-[#374151] tabular-nums">
                            {row.stars} ★
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F1F5F9]">
                            <div
                              className="h-full rounded-full bg-[#047857]"
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-[#6B7280] tabular-nums">
                            {row.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {allReviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[#111827]">
                          {rev.tenantName}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {rev.verifiedResident ? "Verified Resident" : "Resident"} ·{" "}
                          {rev.stayDuration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rev.overallRating} />
                        <span className="text-xs font-bold text-[#111827] tabular-nums">
                          {rev.overallRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#374151]">
                      {rev.comment}
                    </p>

                    {rev.ownerReply && (
                      <div className="mt-3 rounded-xl bg-[#ECFDF5] p-3.5 text-xs text-[#065F46]">
                        <p className="font-bold">Owner Reply</p>
                        <p className="mt-1">{rev.ownerReply.text}</p>
                      </div>
                    )}
                  </article>
                ))}
              </section>
            )}

            {activeTab === "Location" && (
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#111827]">
                    Address & Nearby Transit
                  </h2>
                  <p className="mt-1 text-sm text-[#4B5563]">{pg.address}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {pg.nearbyLandmarks.map((lm) => (
                    <div
                      key={lm.name}
                      className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{lm.name}</p>
                        <p className="text-xs text-[#6B7280]">{lm.type}</p>
                      </div>
                      <span className="text-xs font-bold text-[#047857] tabular-nums">
                        {lm.distance}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <QrCode className="h-8 w-8 shrink-0 text-[#047857]" />
                    <div>
                      <p className="text-sm font-bold text-[#111827]">
                        Already visiting {pg.name}?
                      </p>
                      <p className="text-xs text-[#065F46]">
                        Open the PG's QR joining page to apply directly.
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/join/${pg.id}`}>Open QR Joining</Link>
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Desktop Sticky Booking Card */}
        <aside className="mt-6 hidden lg:col-span-4 lg:mt-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-[#6B7280]">Starting Monthly Rent</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-[#111827] tabular-nums">
              {formatINR(pg.startingRent)}
              <span className="text-sm font-normal text-[#6B7280]">/month</span>
            </p>
            <p className="mt-1 text-xs text-[#047857] font-semibold">
              {hasAvailability
                ? `${pg.availableRooms} rooms / ${pg.availableBeds} beds available now`
                : "Currently full — no open beds right now"}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-[#F1F5F9] pt-4 text-sm text-[#4B5563]">
              <div className="flex justify-between">
                <span>Food (3 meals)</span>
                <span className="font-semibold text-[#111827]">
                  {pg.foodIncluded ? "Included" : "Optional"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PG Type</span>
                <span className="font-semibold text-[#111827]">{pg.genderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Notice Period</span>
                <span className="font-semibold text-[#111827]">30 days</span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              {hasAvailability ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(`/join/${pg.id}`)}
                >
                  {t.requestBooking}
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="w-full" disabled>
                  Currently Unavailable
                </Button>
              )}

              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={() => setVisitOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                {t.scheduleVisit}
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 z-30 border-t border-[#E5E7EB] bg-white/95 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setVisitOpen(true)}
          >
            {t.scheduleVisit}
          </Button>
          {hasAvailability ? (
            <Button
              className="flex-1"
              onClick={() => navigate(`/join/${pg.id}`)}
            >
              {t.requestBooking}
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" disabled>
              Full
            </Button>
          )}
        </div>
      </div>

      {/* Schedule Visit Bottom Sheet */}
      <MobileSheet
        open={visitOpen}
        onOpenChange={setVisitOpen}
        title={`Schedule a visit to ${pg.name}`}
        description="Meet the owner or caretaker and inspect the room before booking."
      >
        <form onSubmit={handleBookVisit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
              Preferred Date
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#111827]"
              required
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#111827]">Time Slot</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "10:00 AM – 10:30 AM",
                "11:00 AM – 11:30 AM",
                "4:00 PM – 4:30 PM",
                "6:00 PM – 6:30 PM",
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setVisitSlot(slot)}
                  className={`min-h-[44px] rounded-xl border px-3 text-xs font-semibold cursor-pointer ${
                    visitSlot === slot
                      ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                      : "border-[#E5E7EB] bg-white text-[#374151]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Confirm Visit Slot
          </Button>
        </form>
      </MobileSheet>
    </div>
  );
}
