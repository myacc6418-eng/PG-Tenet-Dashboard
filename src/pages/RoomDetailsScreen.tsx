import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BedDouble,
  Calendar,
  CheckCircle2,
  Snowflake,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { formatDateShort, formatINR } from "@/src/lib/utils";
import { pgService } from "@/src/services/pgService";

export function RoomDetailsScreen() {
  const { pgId, roomId } = useParams<{ pgId: string; roomId: string }>();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["room", pgId, roomId],
    queryFn: () => pgService.getRoomById(pgId || "", roomId || ""),
    enabled: Boolean(pgId && roomId),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <EmptyState
          icon={BedDouble}
          title="Room not found"
          description="We could not find this room option."
          actionLabel="Back to Explore"
          actionTo="/explore"
        />
      </div>
    );
  }

  const { pg, room } = data;
  const available = room.availableBeds > 0;

  return (
    <div className="pb-24">
      <PageHeader
        title={room.title}
        subtitle={`${pg.name} · ${pg.area}`}
      />

      <div className="mx-auto mt-5 max-w-5xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-7">
          {/* Room Gallery */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="aspect-[4/3] w-full bg-[#F1F5F9]">
              <SafeImage
                src={room.images[selectedImg] || room.images[0]}
                alt={room.title}
                fallbackLabel={room.title}
                className="h-full w-full"
              />
            </div>
            {room.images.length > 1 && (
              <div className="flex gap-2 p-3">
                {room.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImg(i)}
                    className={`h-16 w-24 overflow-hidden rounded-xl border-2 cursor-pointer ${
                      selectedImg === i ? "border-[#047857]" : "border-transparent"
                    }`}
                  >
                    <SafeImage src={img} alt="" className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Room Specifications */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-[#111827]">
                {room.title} {room.roomNumber ? `· ${room.roomNumber}` : ""}
              </h2>
              <StatusBadge
                label={
                  available
                    ? `${room.availableBeds} bed${room.availableBeds > 1 ? "s" : ""} available`
                    : "Sold Out"
                }
                tone={available ? "success" : "error"}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <p className="text-xs text-[#6B7280]">Capacity</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#111827]">
                  <Users className="h-4 w-4 text-[#047857]" />
                  {room.sharingType}
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <p className="text-xs text-[#6B7280]">Cooling</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#111827]">
                  <Snowflake className="h-4 w-4 text-[#047857]" />
                  {room.isAC ? "Split AC" : "Non-AC"}
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <p className="text-xs text-[#6B7280]">Bathroom</p>
                <p className="mt-1 text-sm font-bold text-[#111827]">
                  {room.bathroomType}
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <p className="text-xs text-[#6B7280]">Move-in From</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[#111827]">
                  <Calendar className="h-3.5 w-3.5 text-[#047857]" />
                  {formatDateShort(room.availableFrom)}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#F1F5F9] pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Furnishing Included
              </p>
              <p className="mt-1.5 text-sm text-[#374151]">{room.furnishing}</p>
            </div>

            <div className="mt-4 border-t border-[#F1F5F9] pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Room Amenities
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#065F46]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* PG Rules */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h3 className="font-display text-base font-bold text-[#111827]">
              PG House Rules
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#4B5563]">
              {pg.rules.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Clear Charges Breakdown & Request CTA */}
        <aside className="mt-5 lg:col-span-5 lg:mt-0">
          <div className="sticky top-20 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
            <h3 className="font-display text-lg font-bold text-[#111827]">
              Clear Monthly Charges
            </h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Final room & bed numbers are confirmed by the PG owner after approval.
            </p>

            <div className="mt-4 space-y-3 border-t border-[#F1F5F9] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">
                  Monthly Rent {room.sharingCapacity > 1 ? "(per bed)" : ""}
                </span>
                <span className="font-bold text-[#111827] tabular-nums">
                  {formatINR(room.monthlyRent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">Refundable Security Deposit</span>
                <span className="font-bold text-[#111827] tabular-nums">
                  {formatINR(room.securityDeposit)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#4B5563]">Electricity Charges</span>
                <span className="text-right font-medium text-[#111827]">
                  {room.electricityCharges}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#4B5563]">Food & Mess</span>
                <span className="text-right font-medium text-[#047857]">
                  {room.foodCharges}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#ECFDF5] p-3.5">
              <span className="text-sm font-semibold text-[#065F46]">
                Total Move-in Payable
              </span>
              <span className="font-display text-xl font-extrabold text-[#047857] tabular-nums">
                {formatINR(room.monthlyRent + room.securityDeposit)}
              </span>
            </div>

            <div className="mt-5">
              {available ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(`/join/${pg.id}?roomId=${room.id}`)}
                >
                  Request Room
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="w-full" disabled>
                  Currently Unavailable
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
