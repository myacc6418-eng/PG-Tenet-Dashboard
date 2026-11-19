import { useState } from "react";
import {
  ArrowRight,
  BedDouble,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  IndianRupee,
  MapPin,
  QrCode,
  Search,
  Utensils,
  Wrench,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BrandMark } from "@/src/components/shared/BrandMark";
import { PGCard } from "@/src/components/shared/PGCard";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import { useTenant } from "@/src/context/TenantContext";
import { MOCK_PGS } from "@/src/data/mockData";
import { formatDateShort, formatINR } from "@/src/lib/utils";

export function HomeDashboard() {
  const {
    tenantState,
    user,
    activeStay,
    joiningRequest,
    checkoutRequest,
    payments,
    notices,
    savedPgIds,
    t,
  } = useTenant();
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const isResidentFlow =
    (tenantState === "active_resident" ||
      tenantState === "checkout_requested" ||
      tenantState === "checkout_pending") &&
    activeStay !== null;

  const duePayment = payments.find((p) => p.status !== "Paid") || payments[0];
  const currentPg = MOCK_PGS.find((p) => p.id === activeStay?.pgId) || MOCK_PGS[0];
  const todayMenu = currentPg.weeklyMenu[2]; // Wednesday highlight menu
  const recommendedPgs = MOCK_PGS.filter((pg) => pg.id !== activeStay?.pgId).slice(0, 5);
  const savedPgs = MOCK_PGS.filter((pg) => savedPgIds.includes(pg.id));

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore${searchInput.trim() ? `?q=${encodeURIComponent(searchInput.trim())}` : ""}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-6 sm:px-6 lg:pt-8">
      {/* Mobile Header */}
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="lg:hidden">
            <BrandMark size="sm" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-[#6B7280]">{t.welcomeBack},</p>
            <h1 className="font-display text-2xl font-extrabold text-[#111827]">
              {user ? user.firstName : "Welcome to PG Finder"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setNoticesOpen(true)}
            aria-label="View notifications"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC] cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {notices.length > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#047857]" />
            )}
          </button>

          {user ? (
            <Link
              to="/profile"
              className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[#047857]/20 bg-[#ECFDF5]"
              aria-label="Open profile"
            >
              <SafeImage
                src={user.avatar}
                alt={user.fullName}
                className="h-full w-full"
              />
            </Link>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Mobile Greeting */}
      <div className="mb-5 lg:hidden">
        <p className="text-sm text-[#6B7280]">
          {user ? `${t.welcomeBack}, ${user.firstName}` : "Welcome to PG Finder"}
        </p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#111827]">
          {isResidentFlow ? activeStay.pgName : t.findPerfectPg}
        </h1>
      </div>

      {/* State-aware banners for Joining / Checkout / Logged Out */}
      {tenantState === "logged_out" && (
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-bold text-[#111827]">
              Sign in to manage your PG stay
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Save your favourite PGs, scan owner QR codes to join, and pay monthly rent online.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button variant="outline" onClick={() => navigate("/register")}>
              Create Account
            </Button>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </div>
        </div>
      )}

      {tenantState === "joining_pending" && joiningRequest && (
        <section className="mb-6 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <StatusBadge
                label={
                  joiningRequest.status === "More Details Required"
                    ? "Correction Needed"
                    : "Joining Request Pending"
                }
                tone={
                  joiningRequest.status === "More Details Required"
                    ? "warning"
                    : "info"
                }
              />
              <h2 className="mt-2.5 font-display text-lg font-bold text-[#111827]">
                {joiningRequest.pgName} · {joiningRequest.roomTitle}
              </h2>
              <p className="mt-1 text-sm text-[#065F46]">
                {joiningRequest.ownerNote || t.ownerCheckingDetails}
              </p>
            </div>
            <Button onClick={() => navigate("/requests")}>
              Track Request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {tenantState === "joining_approved" && joiningRequest && (
        <section className="mb-6 rounded-2xl border border-[#047857] bg-white p-5 shadow-xs">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <StatusBadge label="Joining Approved" tone="success" />
              <h2 className="mt-2.5 font-display text-lg font-bold text-[#111827]">
                Your room at {joiningRequest.pgName} is ready!
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Assigned {joiningRequest.confirmedTerms?.assignedRoomNumber},{" "}
                {joiningRequest.confirmedTerms?.assignedBedNumber}. Review and accept terms to confirm check-in.
              </p>
            </div>
            <Button onClick={() => navigate("/requests")}>
              Accept Terms & Proceed
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {tenantState === "upcoming_checkin" && activeStay && (
        <section className="mb-6 rounded-2xl border border-[#A7F3D0] bg-white p-5 shadow-xs">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <StatusBadge label="Upcoming Check-in" tone="success" />
              <h2 className="mt-2 font-display text-lg font-bold text-[#111827]">
                Moving into {activeStay.pgName} on {formatDateShort(activeStay.checkInDate)}
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                {activeStay.roomNumber} · {activeStay.bedNumber} · {activeStay.roomTitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/my-pg")}>
                Stay Details
              </Button>
              <Button onClick={() => navigate("/requests")}>View Check-in</Button>
            </div>
          </div>
        </section>
      )}

      {/* ACTIVE RESIDENT VIEW */}
      {isResidentFlow && activeStay ? (
        <div className="space-y-6">
          {/* Top 2-column Hero on Desktop: Current PG Card + Rent Summary */}
          <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
            {/* Current PG Card */}
            <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs lg:col-span-7 flex flex-col sm:flex-row">
              <div className="relative aspect-[16/10] w-full shrink-0 sm:w-56 sm:aspect-auto">
                <SafeImage
                  src={activeStay.pgImage}
                  alt={activeStay.pgName}
                  fallbackLabel={activeStay.pgName}
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {checkoutRequest && checkoutRequest.status !== "Completed" ? (
                      <StatusBadge label="Checkout Pending" tone="warning" />
                    ) : (
                      <StatusBadge label="Active Stay" tone="success" />
                    )}
                    <Link
                      to="/my-pg"
                      className="text-xs font-semibold text-[#047857] hover:underline"
                    >
                      Open My PG
                    </Link>
                  </div>

                  <h2 className="mt-3 font-display text-xl font-bold text-[#111827]">
                    {activeStay.pgName}
                  </h2>
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-[#6B7280]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                    <span>{activeStay.address}</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#F1F5F9] pt-4 text-sm">
                  <div>
                    <p className="text-xs text-[#6B7280]">Room</p>
                    <p className="font-semibold text-[#111827]">{activeStay.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Bed</p>
                    <p className="font-semibold text-[#111827]">{activeStay.bedNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Sharing</p>
                    <p className="font-semibold text-[#111827]">
                      {activeStay.sharingType} {activeStay.isAC ? "AC" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Rent Summary Card */}
            <section className="flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#6B7280]">
                    Rent Summary · {duePayment?.monthLabel || "Current Month"}
                  </span>
                  <StatusBadge
                    label={duePayment?.status === "Paid" ? "Paid" : "Payment Due"}
                    tone={duePayment?.status === "Paid" ? "success" : "warning"}
                  />
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <div>
                    <p className="font-display text-3xl font-extrabold text-[#111827] tabular-nums">
                      {formatINR(duePayment?.totalAmount || activeStay.monthlyRent)}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Next due date: {formatDateShort(duePayment?.dueDate || activeStay.rentDueDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <Button
                  className="flex-1"
                  onClick={() => navigate("/my-pg/payments")}
                >
                  <IndianRupee className="h-4 w-4" />
                  {duePayment?.status === "Paid" ? "View Receipts" : t.payRent}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/my-pg/checkout")}
                >
                  Checkout
                </Button>
              </div>
            </section>
          </div>

          {/* 4 Quick Actions */}
          <section>
            <h2 className="mb-3 font-display text-base font-bold text-[#111827]">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: t.myRoom, icon: BedDouble, to: "/my-pg/room", hint: activeStay.roomNumber },
                { label: t.foodMenu, icon: Utensils, to: "/my-pg/food", hint: "Today's meals" },
                { label: t.complaints, icon: Wrench, to: "/requests?tab=complaints", hint: "Raise issue" },
                { label: t.documents, icon: FileText, to: "/my-pg/documents", hint: "ID & receipts" },
              ].map((qa) => {
                const Icon = qa.icon;
                return (
                  <Link
                    key={qa.label}
                    to={qa.to}
                    className="flex min-h-[88px] flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#047857] hover:bg-[#ECFDF5]/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="mt-3">
                      <p className="text-sm font-bold text-[#111827]">{qa.label}</p>
                      <p className="text-xs text-[#6B7280]">{qa.hint}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Today's Food + Announcements */}
          <div className="grid gap-5 lg:grid-cols-12">
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 lg:col-span-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-[#111827]">
                  {t.todaysFood}
                </h2>
                <Link
                  to="/my-pg/food"
                  className="text-xs font-semibold text-[#047857] hover:underline"
                >
                  Weekly Menu & Feedback
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Breakfast", meal: todayMenu.breakfast },
                  { label: "Lunch", meal: todayMenu.lunch },
                  { label: "Dinner", meal: todayMenu.dinner },
                ].map(({ label, meal }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3.5"
                  >
                    <p className="text-xs font-semibold text-[#047857]">{label}</p>
                    <p className="mt-1 text-sm font-bold text-[#111827] line-clamp-1">
                      {meal.title}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280]">{meal.time}</p>
                    <p className="mt-2 text-xs text-[#4B5563] line-clamp-2">
                      {meal.items.slice(0, 3).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 lg:col-span-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-[#111827]">
                  {t.announcements}
                </h2>
                <Link
                  to="/my-pg/notices"
                  className="text-xs font-semibold text-[#047857] hover:underline"
                >
                  See all
                </Link>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {notices.slice(0, 3).map((notice) => (
                  <div key={notice.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#111827] line-clamp-1">
                        {notice.title}
                      </p>
                      <span className="text-xs text-[#6B7280] shrink-0">
                        {formatDateShort(notice.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280] line-clamp-2">
                      {notice.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : (
        /* NON-RESIDENT HOME DASHBOARD */
        <div className="space-y-7">
          {/* Search PGs Hero */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-7">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="font-display text-xl font-extrabold text-[#111827] sm:text-2xl text-balance">
                  Find verified PGs with clear rent, real room photos, and instant QR joining
                </h2>
                <p className="mt-2 text-sm text-[#6B7280]">
                  Compare single, double, and triple sharing rooms across Hyderabad, Bengaluru, and Pune.
                </p>

                <form onSubmit={handleQuickSearch} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search Madhapur, Koramangala, Indiranagar..."
                      className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#111827] focus:border-[#047857] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <Button type="submit" size="lg">
                    Search PGs
                  </Button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Hyderabad", "Bengaluru", "Pune"].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => navigate(`/explore?city=${city}`)}
                      className="min-h-[40px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 text-xs font-semibold text-[#374151] hover:border-[#047857] hover:text-[#047857] cursor-pointer"
                    >
                      {city} PGs
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5 lg:col-span-5">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#047857] text-white">
                    <QrCode className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#111827]">
                      Have a PG owner QR code?
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#065F46]">
                      Scan a PG's joining QR to submit your 5-step tenant details and get room approval directly.
                    </p>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate("/join/pg-green-nest")}
                    >
                      Try QR Join: Green Nest PG
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Saved Properties */}
          {savedPgs.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#111827]">
                  Saved Properties
                </h2>
                <Link
                  to="/explore"
                  className="text-xs font-semibold text-[#047857] hover:underline"
                >
                  Explore all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedPgs.map((pg) => (
                  <PGCard key={pg.id} pg={pg} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Recommended PGs Carousel / Grid */}
      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#111827]">
              {t.recommendedPgs}
            </h2>
            <p className="text-xs text-[#6B7280]">
              Verified stays with transparent monthly pricing
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#047857] hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {recommendedPgs.slice(0, 3).map((pg) => (
            <div key={pg.id} className="w-[290px] shrink-0 lg:w-auto">
              <PGCard pg={pg} compact />
            </div>
          ))}
        </div>
      </section>

      {/* Notifications Sheet */}
      <MobileSheet
        open={noticesOpen}
        onOpenChange={setNoticesOpen}
        title="PG Notices & Updates"
        description="Important reminders from your PG management"
      >
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {n.priority}
                </span>
                <span className="text-xs text-[#6B7280]">
                  {formatDateShort(n.date)}
                </span>
              </div>
              <h3 className="mt-1.5 text-sm font-bold text-[#111827]">{n.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#4B5563]">{n.body}</p>
            </div>
          ))}
          {joiningRequest && (
            <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#047857]">
                <ClipboardCheck className="h-4 w-4" />
                Joining Request Update
              </div>
              <p className="mt-1 text-sm font-bold text-[#111827]">
                {joiningRequest.pgName}: {joiningRequest.status}
              </p>
            </div>
          )}
          {checkoutRequest && (
            <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#92400E]">
                <CalendarClock className="h-4 w-4" />
                Checkout Request
              </div>
              <p className="mt-1 text-sm font-bold text-[#111827]">
                Status: {checkoutRequest.status}
              </p>
            </div>
          )}
        </div>
      </MobileSheet>
    </div>
  );
}
