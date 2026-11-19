import {
  BedDouble,
  Bell,
  BookOpen,
  CalendarDays,
  FileText,
  IndianRupee,
  LogOut,
  MapPin,
  Phone,
  Star,
  Utensils,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";
import { formatDateShort, formatINR } from "@/src/lib/utils";

export function MyPGDashboard() {
  const { tenantState, activeStay, checkoutRequest, t } = useTenant();

  if (!activeStay || tenantState === "logged_out" || tenantState === "no_pg" || tenantState === "checked_out") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={BedDouble}
          title="No Active PG Stay Yet"
          description="Once your joining request is approved and you check in, your room, rent, food menu, documents, and checkout controls will appear here."
          actionLabel="Explore PGs"
          actionTo="/explore"
        />
      </div>
    );
  }

  if (tenantState === "joining_pending" || tenantState === "joining_approved") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={BedDouble}
          title="Your Joining Request is In Progress"
          description="Track owner verification or accept your confirmed room terms in Requests."
          actionLabel="Open Request Tracker"
          actionTo="/requests"
        />
      </div>
    );
  }

  const services = [
    { label: "My Room", desc: `${activeStay.roomNumber} · ${activeStay.bedNumber}`, icon: BedDouble, to: "/my-pg/room" },
    { label: "Rent & Payments", desc: "Pay rent & receipts", icon: IndianRupee, to: "/my-pg/payments" },
    { label: "Food & Mess", desc: "Daily & weekly menu", icon: Utensils, to: "/my-pg/food" },
    { label: "My Documents", desc: "Agreements & receipts", icon: FileText, to: "/my-pg/documents" },
    { label: "Complaints", desc: "Maintenance & fixes", icon: Wrench, to: "/requests?tab=complaints" },
    { label: "Notices", desc: "PG announcements", icon: Bell, to: "/my-pg/notices" },
    { label: "PG Rules", desc: "House guidelines", icon: BookOpen, to: "/my-pg/rules" },
    { label: "Stay Details", desc: "Bed & deposit info", icon: CalendarDays, to: "/my-pg/stay" },
    { label: "Rate My PG", desc: "Share your review", icon: Star, to: "/my-pg/rate" },
    { label: t.requestCheckout, desc: "Move-out & deposit", icon: LogOut, to: "/my-pg/checkout" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5 pb-12 sm:px-6 lg:pt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#111827]">
            My PG Stay
          </h1>
          <p className="text-sm text-[#6B7280]">{t.yourRoomAndBed}</p>
        </div>
        {checkoutRequest && checkoutRequest.status !== "Completed" ? (
          <StatusBadge label="Checkout Pending" tone="warning" />
        ) : tenantState === "upcoming_checkin" ? (
          <StatusBadge label="Upcoming Check-in" tone="info" />
        ) : (
          <StatusBadge label="Active Resident" tone="success" />
        )}
      </div>

      {/* Main Stay Summary Card */}
      <section className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-xs lg:grid lg:grid-cols-12">
        <div className="aspect-[16/10] w-full bg-[#F1F5F9] lg:col-span-5 lg:aspect-auto">
          <SafeImage
            src={activeStay.pgImage}
            alt={activeStay.pgName}
            fallbackLabel={activeStay.pgName}
            className="h-full w-full"
          />
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-7">
          <div>
            <h2 className="font-display text-xl font-extrabold text-[#111827] sm:text-2xl">
              {activeStay.pgName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
              <MapPin className="h-4 w-4 shrink-0 text-[#047857]" />
              <span>{activeStay.location}</span>
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 border-y border-[#F1F5F9] py-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-[#6B7280]">Room & Bed</p>
                <p className="mt-0.5 text-sm font-bold text-[#111827]">
                  {activeStay.roomNumber} · {activeStay.bedNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Sharing Type</p>
                <p className="mt-0.5 text-sm font-bold text-[#111827]">
                  {activeStay.sharingType} {activeStay.isAC ? "AC" : "Non-AC"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Check-in Date</p>
                <p className="mt-0.5 text-sm font-bold text-[#111827]">
                  {formatDateShort(activeStay.checkInDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Monthly Rent</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-[#047857] tabular-nums">
                  {formatINR(activeStay.monthlyRent)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Security Deposit</p>
                <p className="mt-0.5 text-sm font-bold text-[#111827] tabular-nums">
                  {formatINR(activeStay.securityDeposit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Next Rent Due</p>
                <p className="mt-0.5 text-sm font-bold text-[#111827]">
                  {formatDateShort(activeStay.rentDueDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#4B5563]">
              <span className="font-semibold text-[#111827]">Owner:</span>{" "}
              {activeStay.ownerName} ·{" "}
              <span className="font-semibold text-[#111827]">Caretaker:</span>{" "}
              {activeStay.caretakerName}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  toast.info(`Calling ${activeStay.caretakerName}: ${activeStay.caretakerPhone}`)
                }
              >
                <Phone className="h-3.5 w-3.5" />
                Caretaker
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.info(`Calling ${activeStay.ownerName}: ${activeStay.ownerPhone}`)
                }
              >
                <Phone className="h-3.5 w-3.5" />
                Owner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Service Cards */}
      <section className="mt-7">
        <h2 className="mb-3.5 font-display text-lg font-bold text-[#111827]">
          Stay Services
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.label}
                to={srv.to}
                className="flex min-h-[108px] flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-all hover:border-[#047857] hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3">
                  <p className="text-sm font-bold text-[#111827]">{srv.label}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280] line-clamp-1">
                    {srv.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
