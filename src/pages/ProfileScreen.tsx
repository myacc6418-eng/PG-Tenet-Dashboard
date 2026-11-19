import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Globe,
  Heart,
  HelpCircle,
  History,
  KeyRound,
  LogOut,
  PhoneCall,
  Star,
  UserCheck,
  Volume2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import { Switch } from "@/src/components/ui/switch";
import { useTenant } from "@/src/context/TenantContext";
import { formatDateShort, formatINR } from "@/src/lib/utils";
import { LanguageCode } from "@/src/types";

export function ProfileScreen() {
  const {
    user,
    tenantState,
    pastStays,
    savedPgIds,
    visits,
    submittedReviews,
    language,
    audioGuidanceEnabled,
    setLanguage,
    setAudioGuidanceEnabled,
    updateProfile,
    logout,
  } = useTenant();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [emergName, setEmergName] = useState(user?.emergencyContact.name || "");
  const [emergMobile, setEmergMobile] = useState(user?.emergencyContact.mobile || "");

  if (tenantState === "logged_out" || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <EmptyState
          icon={UserCheck}
          title="Sign in to view your Profile"
          description="Access your saved PGs, stay history, documents, and language preferences with one tenant account."
          actionLabel="Sign In"
          actionTo="/login"
        />
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      mobile,
      occupation,
      emergencyContact: {
        ...user.emergencyContact,
        name: emergName,
        mobile: emergMobile,
      },
    });
    setEditOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-5 pb-12 sm:px-6 lg:pt-8">
      <h1 className="font-display text-2xl font-extrabold text-[#111827]">
        Profile & Stay History
      </h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        {/* Left Profile Card + Preferences */}
        <div className="space-y-5 lg:col-span-5">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#047857]/25 bg-[#ECFDF5] shrink-0">
                <SafeImage
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold text-[#111827] truncate">
                  {user.fullName}
                </h2>
                <p className="text-sm text-[#6B7280] truncate">{user.email}</p>
                <p className="text-xs text-[#4B5563] tabular-nums">{user.mobile}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2.5">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setFullName(user.fullName);
                  setMobile(user.mobile);
                  setOccupation(user.occupation);
                  setEmergName(user.emergencyContact.name);
                  setEmergMobile(user.emergencyContact.mobile);
                  setEditOpen(true);
                }}
              >
                Edit Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setPasswordOpen(true)}
              >
                <KeyRound className="h-4 w-4" />
                Password
              </Button>
            </div>
          </section>

          {/* Language & Accessibility */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#047857]" />
              <h3 className="font-display text-base font-bold text-[#111827]">
                Language & Accessibility
              </h3>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-[#6B7280]">
                App Language
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { code: "en", label: "English" },
                    { code: "te", label: "తెలుగు" },
                    { code: "hi", label: "हिन्दी" },
                  ] as { code: LanguageCode; label: string }[]
                ).map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      toast.success(`Language set to ${l.label}`);
                    }}
                    className={`min-h-[44px] rounded-xl border text-xs font-semibold cursor-pointer ${
                      language === l.code
                        ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                        : "border-[#E5E7EB] bg-white text-[#374151]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3">
              <div className="flex items-center gap-2.5">
                <Volume2 className="h-4 w-4 text-[#047857]" />
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Audio Guidance Helper
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Show Read Aloud button on forms
                  </p>
                </div>
              </div>
              <Switch
                checked={audioGuidanceEnabled}
                onCheckedChange={setAudioGuidanceEnabled}
              />
            </div>
          </section>

          {/* Account Menu Links */}
          <section className="divide-y divide-[#F1F5F9] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            {[
              { label: "My Documents", hint: "IDs & receipts", icon: FileText, to: "/my-pg/documents" },
              { label: "Saved PGs", hint: `${savedPgIds.length} saved`, icon: Heart, to: "/explore" },
              { label: "My Bookings & Visits", hint: `${visits.length} scheduled`, icon: PhoneCall, to: "/requests" },
              { label: "My Reviews", hint: `${submittedReviews.length} posted`, icon: Star, to: "/my-pg/rate" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex min-h-[56px] items-center justify-between px-4 py-3 hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                      <p className="text-xs text-[#6B7280]">{item.hint}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#9CA3AF]" />
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() =>
                toast.info("PG Finder Support", {
                  description: "Helpline: +91 80 4567 8900 (9 AM – 9 PM IST)",
                })
              }
              className="flex min-h-[56px] w-full items-center justify-between px-4 py-3 text-left hover:bg-[#F8FAFC] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#374151]">
                  <HelpCircle className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Help & Support</p>
                  <p className="text-xs text-[#6B7280]">Call or chat support</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#9CA3AF]" />
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left text-[#EF4444] hover:bg-[#FEF2F2] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-bold">Logout</span>
            </button>
          </section>
        </div>

        {/* Right Column: Emergency Contact + Previous PG Stays */}
        <div className="space-y-5 lg:col-span-7">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h3 className="font-display text-base font-bold text-[#111827]">
              Emergency Contact
            </h3>
            <p className="mt-1 text-sm text-[#4B5563]">
              {user.emergencyContact.name} ({user.emergencyContact.relationship}) ·{" "}
              <span className="font-semibold text-[#111827] tabular-nums">
                {user.emergencyContact.mobile}
              </span>
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#047857]" />
              <h3 className="font-display text-lg font-bold text-[#111827]">
                Previous PG Stays ({pastStays.length})
              </h3>
            </div>

            {pastStays.length === 0 ? (
              <EmptyState
                icon={History}
                title="No previous PG stays yet"
                description="Completed PG stays and deposit settlements will stay saved here forever."
              />
            ) : (
              pastStays.map((stay) => (
                <article
                  key={stay.stayId}
                  className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:flex sm:gap-4"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#F1F5F9] sm:w-44 sm:shrink-0">
                    <SafeImage
                      src={stay.pgImage}
                      alt={stay.pgName}
                      fallbackLabel={stay.pgName}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-3 flex flex-1 flex-col justify-between sm:mt-0">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base font-bold text-[#111827]">
                          {stay.pgName}
                        </h4>
                        <StatusBadge label="Checked Out" tone="neutral" />
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {stay.location} · {stay.roomNumber} ({stay.sharingType})
                      </p>
                      <p className="mt-2 text-xs text-[#374151]">
                        {formatDateShort(stay.checkInDate)} –{" "}
                        {formatDateShort(stay.checkOutDate)} ({stay.durationLabel})
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#047857] tabular-nums">
                        Deposit Refunded: {formatINR(stay.depositRefunded)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#F1F5F9] pt-3">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/my-pg/documents">Receipts & Clearance</Link>
                      </Button>
                      {!stay.hasReviewed && (
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/my-pg/rate/${stay.pgId}`}>Rate PG</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </div>

      {/* Edit Profile Sheet */}
      <MobileSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Profile & Emergency Contact"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-[#E5E7EB] px-3.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-[#E5E7EB] px-3.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Work / College</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-[#E5E7EB] px-3.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold">Emergency Contact</label>
              <input
                type="text"
                value={emergName}
                onChange={(e) => setEmergName(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-[#E5E7EB] px-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Emergency Mobile</label>
              <input
                type="tel"
                value={emergMobile}
                onChange={(e) => setEmergMobile(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-[#E5E7EB] px-3 text-sm"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full">
            Save Changes
          </Button>
        </form>
      </MobileSheet>

      {/* Change Password Sheet (Demo) */}
      <MobileSheet
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        title="Change Password (Demo)"
        description="No real password is persisted in this frontend demonstration."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Demo password change confirmed");
            setPasswordOpen(false);
          }}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="Current password"
            required
            className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          />
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            minLength={8}
            required
            className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          />
          <Button type="submit" size="lg" className="w-full">
            Update Password
          </Button>
        </form>
      </MobileSheet>
    </div>
  );
}
