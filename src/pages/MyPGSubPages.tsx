import { BedDouble, Bell, BookOpen, CalendarDays, CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";
import { MOCK_PGS } from "@/src/data/mockData";
import { formatDateShort, formatINR } from "@/src/lib/utils";

export function MyRoomScreen() {
  const { activeStay } = useTenant();
  if (!activeStay) {
    return (
      <div className="p-6">
        <EmptyState
          icon={BedDouble}
          title="No room assigned"
          description="You do not have an active PG room right now."
          actionLabel="Explore PGs"
          actionTo="/explore"
        />
      </div>
    );
  }
  const pg = MOCK_PGS.find((p) => p.id === activeStay.pgId) || MOCK_PGS[0];
  const room = pg.rooms.find((r) => r.id === activeStay.roomId) || pg.rooms[0];

  return (
    <div className="pb-16">
      <PageHeader title="My Room" subtitle={`${activeStay.roomNumber} · ${activeStay.bedNumber}`} />
      <div className="mx-auto mt-5 max-w-4xl space-y-5 px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <SafeImage
            src={room.images[0]}
            alt={room.title}
            fallbackLabel={room.title}
            className="aspect-[16/9] max-h-72 w-full"
          />
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-[#111827]">
                {activeStay.roomNumber} ({activeStay.bedNumber})
              </h2>
              <StatusBadge label="Occupied by You" tone="success" />
            </div>
            <p className="mt-1 text-sm text-[#6B7280]">
              {room.title} · {room.bathroomType} Bathroom
            </p>
            <p className="mt-3 text-sm text-[#374151]">{room.furnishing}</p>

            <div className="mt-4 flex flex-wrap gap-2">
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

            <div className="mt-5 flex flex-wrap gap-3 border-t border-[#F1F5F9] pt-4">
              <Button asChild variant="secondary">
                <Link to="/requests?tab=complaints">Report Room Issue</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.info(`Calling Caretaker ${activeStay.caretakerName}: ${activeStay.caretakerPhone}`)
                }
              >
                <Phone className="h-4 w-4" />
                Call Caretaker
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NoticesScreen() {
  const { notices, activeStay } = useTenant();
  return (
    <div className="pb-16">
      <PageHeader title="PG Notices" subtitle={activeStay?.pgName || "Announcements"} />
      <div className="mx-auto mt-5 max-w-3xl space-y-3.5 px-4 sm:px-6">
        {notices.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <StatusBadge
                label={n.priority}
                tone={n.priority === "Important" ? "warning" : "info"}
              />
              <span className="text-xs text-[#6B7280]">{formatDateShort(n.date)}</span>
            </div>
            <h2 className="mt-2.5 font-display text-base font-bold text-[#111827]">
              {n.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{n.body}</p>
          </article>
        ))}
        {notices.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No notices right now"
            description="Announcements from your PG owner will appear here."
          />
        )}
      </div>
    </div>
  );
}

export function PGRulesScreen() {
  const { activeStay } = useTenant();
  const pg = MOCK_PGS.find((p) => p.id === activeStay?.pgId) || MOCK_PGS[0];
  return (
    <div className="pb-16">
      <PageHeader title="PG Rules" subtitle={pg.name} />
      <div className="mx-auto mt-5 max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-[#047857]" />
            <h2 className="font-display text-lg font-bold text-[#111827]">
              House Guidelines for Residents
            </h2>
          </div>
          <ul className="space-y-3">
            {pg.rules.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-sm text-[#374151]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function StayDetailsScreen() {
  const { activeStay } = useTenant();
  if (!activeStay) {
    return (
      <div className="p-6">
        <EmptyState
          icon={CalendarDays}
          title="No active stay"
          description="Join a PG to view your active stay agreement and bed details."
          actionLabel="Explore PGs"
          actionTo="/explore"
        />
      </div>
    );
  }
  return (
    <div className="pb-16">
      <PageHeader title="Stay Details" subtitle={activeStay.pgName} />
      <div className="mx-auto mt-5 max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 text-sm">
          <h2 className="font-display text-lg font-bold text-[#111827]">
            Confirmed Stay Record
          </h2>
          <div className="divide-y divide-[#F1F5F9]">
            {[
              ["PG Name", activeStay.pgName],
              ["Address", activeStay.address],
              ["Room & Bed", `${activeStay.roomNumber} · ${activeStay.bedNumber}`],
              ["Room Type", `${activeStay.roomTitle} (${activeStay.sharingType})`],
              ["Check-in Date", formatDateShort(activeStay.checkInDate)],
              ["Monthly Rent", formatINR(activeStay.monthlyRent)],
              ["Security Deposit", formatINR(activeStay.securityDeposit)],
              ["Rent Due Day", formatDateShort(activeStay.rentDueDate)],
              ["Owner", `${activeStay.ownerName} (${activeStay.ownerPhone})`],
              ["Caretaker", `${activeStay.caretakerName} (${activeStay.caretakerPhone})`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <span className="text-[#6B7280]">{k}</span>
                <span className="text-right font-semibold text-[#111827]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
