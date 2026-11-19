import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  FileUp,
  Heart,
  Image as ImageIcon,
  MapPin,
  QrCode,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";
import { IMG } from "@/src/data/mockData";
import { formatINR } from "@/src/lib/utils";
import { evaluateJoinEligibility, pgService } from "@/src/services/pgService";
import { JoiningDocument } from "@/src/types";

export function JoinPGScreen() {
  const { pgId } = useParams<{ pgId: string }>();
  const [searchParams] = useSearchParams();
  const initialRoomId = searchParams.get("roomId") || "";
  const navigate = useNavigate();

  const {
    tenantState,
    user,
    activeStay,
    savedPgIds,
    toggleSavedPg,
    submitJoiningRequest,
    t,
  } = useTenant();

  const { data: pg, isLoading } = useQuery({
    queryKey: ["pg", pgId],
    queryFn: () => pgService.getPGById(pgId || ""),
    enabled: Boolean(pgId),
  });

  const [startedForm, setStartedForm] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Step 1 — Personal Details (pre-filled from account)
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [dob, setDob] = useState(user?.dob || "1999-06-14");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [permanentAddress, setPermanentAddress] = useState(
    user?.permanentAddress || ""
  );

  // Step 2 — Room Preference
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [expectedDate, setExpectedDate] = useState("2026-12-01");
  const [roomPreferenceNote, setRoomPreferenceNote] = useState("Window-side bed preferred");

  // Step 3 — Mock Documents
  const [documents, setDocuments] = useState<JoiningDocument[]>([
    {
      id: "doc-photo-init",
      label: "Tenant Photograph",
      fileName: "tenant_selfie_demo.jpg",
      type: "photo",
      uploadedAt: new Date().toISOString().split("T")[0],
      previewUrl: IMG.avatar,
    },
  ]);

  // Step 4 — Emergency Contact
  const [emergencyName, setEmergencyName] = useState(
    user?.emergencyContact.name || ""
  );
  const [emergencyRelation, setEmergencyRelation] = useState(
    user?.emergencyContact.relationship || "Father"
  );
  const [emergencyMobile, setEmergencyMobile] = useState(
    user?.emergencyContact.mobile || ""
  );

  // Step 5 — Rules Acknowledgement
  const [rulesAccepted, setRulesAccepted] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName((v) => v || user.fullName);
      setEmail((v) => v || user.email);
      setMobile((v) => v || user.mobile);
      setDob((v) => v || user.dob);
      setOccupation((v) => v || user.occupation);
      setPermanentAddress((v) => v || user.permanentAddress);
      setEmergencyName((v) => v || user.emergencyContact.name);
      setEmergencyRelation((v) => v || user.emergencyContact.relationship);
      setEmergencyMobile((v) => v || user.emergencyContact.mobile);
    }
  }, [user]);

  useEffect(() => {
    if (pg && !selectedRoomId) {
      const firstAvail = pg.rooms.find((r) => r.availableBeds > 0) || pg.rooms[0];
      if (firstAvail) setSelectedRoomId(firstAvail.id);
    }
  }, [pg, selectedRoomId]);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-[#6B7280]">
        Loading PG joining page...
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <EmptyState
          icon={QrCode}
          title="Invalid PG QR Code"
          description="This QR link does not match an active PG property."
          actionLabel="Explore PGs"
          actionTo="/explore"
        />
      </div>
    );
  }

  const eligibility = evaluateJoinEligibility(tenantState, activeStay, pg.id);
  const selectedRoom =
    pg.rooms.find((r) => r.id === selectedRoomId) || pg.rooms[0];
  const isSaved = savedPgIds.includes(pg.id);

  const addMockDocument = (
    docType: JoiningDocument["type"],
    label: string,
    sourceName: string
  ) => {
    const newDoc: JoiningDocument = {
      id: `jdoc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label,
      fileName: sourceName,
      type: docType,
      uploadedAt: new Date().toISOString().split("T")[0],
      previewUrl: docType === "photo" ? IMG.avatar : undefined,
    };
    setDocuments((prev) => [
      ...prev.filter((d) => d.type !== docType),
      newDoc,
    ]);
  };

  const removeDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleNextStep = () => {
    setFormError("");
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !mobile.trim() || !permanentAddress.trim()) {
        setFormError("Please fill in your name, email, mobile number, and address.");
        return;
      }
    }
    if (step === 2) {
      if (!selectedRoom || !expectedDate) {
        setFormError("Please choose a room type and expected check-in date.");
        return;
      }
    }
    if (step === 3) {
      const hasPhoto = documents.some((d) => d.type === "photo");
      const hasId = documents.some((d) => d.type === "id_proof");
      if (!hasPhoto || !hasId) {
        setFormError("Please attach both your photo and an identity proof to continue.");
        return;
      }
    }
    if (step === 4) {
      if (!emergencyName.trim() || !emergencyMobile.trim()) {
        setFormError("Please enter a family or emergency contact name and mobile number.");
        return;
      }
    }
    setStep((s) => (s < 5 ? ((s + 1) as 1 | 2 | 3 | 4 | 5) : s));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = () => {
    if (!rulesAccepted) {
      setFormError("Please confirm that you agree to follow the PG rules.");
      return;
    }
    if (!selectedRoom) return;

    submitJoiningRequest({
      pgId: pg.id,
      pgName: pg.name,
      pgImage: pg.images[0],
      pgLocation: `${pg.area}, ${pg.city}`,
      roomId: selectedRoom.id,
      roomTitle: selectedRoom.title,
      sharingType: selectedRoom.sharingType,
      isAC: selectedRoom.isAC,
      expectedCheckInDate: expectedDate,
      advertisedRent: selectedRoom.monthlyRent,
      advertisedDeposit: selectedRoom.securityDeposit,
      personalDetails: {
        fullName,
        email,
        mobile,
        dob,
        occupation,
        permanentAddress,
      },
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelation,
        mobile: emergencyMobile,
      },
      documents,
    });
    setSubmittedSuccess(true);
  };

  const stepTitles = [
    t.stepPersonal,
    t.stepRoom,
    t.stepDocuments,
    t.stepEmergency,
    t.stepReview,
  ];

  // Confirmation screen after submission
  if (submittedSuccess) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-7 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-[#111827]">
            Your request has been sent to the PG owner.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            {pg.ownerName} will check your details and confirm your exact room, bed number, and move-in terms.
          </p>
          <div className="mt-6 space-y-2.5">
            <Button size="lg" className="w-full" onClick={() => navigate("/requests")}>
              Track Joining Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader
        title={startedForm ? `Join ${pg.name}` : "PG QR Joining"}
        subtitle={`${pg.area}, ${pg.city}`}
        audioText={
          startedForm
            ? `Step ${step} of 5: ${stepTitles[step - 1]}`
            : `You scanned the joining QR for ${pg.name}`
        }
      />

      <div className="mx-auto mt-5 max-w-3xl px-4 sm:px-6">
        {/* Step 0: QR Landing Card & Business Rules Gate */}
        {!startedForm ? (
          <div className="space-y-5">
            {/* Scanned PG Preview */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="relative aspect-[16/9] max-h-64 w-full bg-[#F1F5F9]">
                <SafeImage
                  src={pg.images[0]}
                  alt={pg.name}
                  fallbackLabel={pg.name}
                  className="h-full w-full"
                />
                <div className="absolute left-3 top-3">
                  <StatusBadge label="Verified PG QR" tone="success" />
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-display text-2xl font-extrabold text-[#111827]">
                  {pg.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                  <MapPin className="h-4 w-4 text-[#047857]" />
                  {pg.address}
                </p>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {pg.rooms.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{r.title}</p>
                        <p className="text-xs text-[#6B7280]">
                          {r.availableBeds > 0
                            ? `${r.availableBeds} bed${r.availableBeds > 1 ? "s" : ""} open`
                            : "Full"}
                        </p>
                      </div>
                      <span className="font-display text-sm font-extrabold text-[#047857] tabular-nums">
                        {formatINR(r.monthlyRent)}/mo
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gate 1: Logged Out */}
            {eligibility.reason === "logged_out" && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="font-display text-lg font-bold text-[#111827]">
                  Sign in to continue joining {pg.name}
                </h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  After signing in or creating your account, you will return directly to this joining page.
                </p>
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <Button asChild size="lg" className="flex-1">
                    <Link to={`/login?redirect=${encodeURIComponent(`/join/${pg.id}`)}`}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1">
                    <Link to={`/register?redirect=${encodeURIComponent(`/join/${pg.id}`)}`}>
                      Create Account
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Gate 2: ONE ACTIVE PG RULE ENFORCEMENT */}
            {(eligibility.reason === "already_active_other_pg" ||
              eligibility.reason === "checkout_in_progress" ||
              eligibility.reason === "same_pg_active") &&
              activeStay && (
                <div className="rounded-2xl border border-[#F59E0B] bg-[#FFFBEB] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-[#B45309]" />
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold text-[#111827]">
                        You are already staying in another PG.
                      </h3>
                      <p className="mt-1 text-sm text-[#78350F]">
                        {eligibility.reason === "checkout_in_progress"
                          ? `Your checkout from ${activeStay.pgName} is currently pending owner approval. Once completed, you can join ${pg.name}.`
                          : eligibility.reason === "same_pg_active"
                          ? `You are already an active resident at ${activeStay.pgName} (${activeStay.roomNumber}, ${activeStay.bedNumber}).`
                          : `You can only have one active PG stay at a time. Complete checkout from ${activeStay.pgName} before activating a stay here.`}
                      </p>

                      <div className="mt-4 rounded-xl border border-[#FDE68A] bg-white p-3.5">
                        <p className="text-xs font-semibold text-[#6B7280]">
                          Your Current PG
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-[#111827]">
                          {activeStay.pgName} · {activeStay.roomNumber}, {activeStay.bedNumber}
                        </p>
                        <p className="text-xs text-[#6B7280]">{activeStay.location}</p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <Button
                          className="flex-1"
                          onClick={() => navigate("/my-pg/checkout")}
                        >
                          {eligibility.reason === "checkout_in_progress"
                            ? "View Checkout Status"
                            : t.requestCheckout}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-white"
                          onClick={() => {
                            if (!isSaved) toggleSavedPg(pg.id);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isSaved ? "fill-[#EF4444] text-[#EF4444]" : ""
                            }`}
                          />
                          {isSaved ? "Saved for Later" : "Save PG for Later"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Gate 3: Existing Joining Request Pending/Approved */}
            {eligibility.reason === "pending_request" && (
              <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5">
                <h3 className="font-display text-lg font-bold text-[#111827]">
                  You already have an open joining request
                </h3>
                <p className="mt-1 text-sm text-[#065F46]">
                  Track or manage your current joining request before submitting a new one.
                </p>
                <Button className="mt-4" onClick={() => navigate("/requests")}>
                  View My Request
                </Button>
              </div>
            )}

            {/* Gate 4: Eligible to Join */}
            {eligibility.allowed && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="font-display text-lg font-bold text-[#111827]">
                  Ready to join {pg.name}?
                </h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Complete 5 simple steps. It takes under 2 minutes and your account details are already filled in.
                </p>
                <Button
                  size="lg"
                  className="mt-4 w-full"
                  onClick={() => setStartedForm(true)}
                >
                  {t.continueJoining}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* 5-STEP TENANT JOINING FORM */
          <div className="space-y-5">
            {/* Progress Header */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#047857]">
                <span>
                  Step {step} of 5 · {stepTitles[step - 1]}
                </span>
                <span className="tabular-nums">{step * 20}%</span>
              </div>
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                <div
                  className="h-full rounded-full bg-[#047857] transition-all duration-300"
                  style={{ width: `${step * 20}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#111827]">
                      1. {t.stepPersonal}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      We filled this in from your profile. Check and update if needed.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Work or College Name
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Software Engineer / B.Tech Student"
                      className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Home / Permanent Address
                    </label>
                    <textarea
                      rows={2}
                      value={permanentAddress}
                      onChange={(e) => setPermanentAddress(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] p-3.5 text-base"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Room Preference */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#111827]">
                      2. {t.stepRoom}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Pick your preferred room type at {pg.name}.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {pg.rooms.map((r) => {
                      const active = r.id === selectedRoom?.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRoomId(r.id)}
                          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                            active
                              ? "border-[#047857] bg-[#ECFDF5]"
                              : "border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#111827]">{r.title}</p>
                            <p className="mt-0.5 text-xs text-[#6B7280]">
                              {r.sharingType} Sharing · {r.isAC ? "AC" : "Non-AC"} ·{" "}
                              {r.availableBeds > 0
                                ? `${r.availableBeds} beds open`
                                : "Waitlist"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-base font-extrabold text-[#047857] tabular-nums">
                              {formatINR(r.monthlyRent)}/mo
                            </p>
                            <p className="text-xs text-[#6B7280] tabular-nums">
                              Deposit {formatINR(r.securityDeposit)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Expected Move-in Date
                      </label>
                      <input
                        type="date"
                        value={expectedDate}
                        onChange={(e) => setExpectedDate(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Any Room Preference (Optional)
                      </label>
                      <input
                        type="text"
                        value={roomPreferenceNote}
                        onChange={(e) => setRoomPreferenceNote(e.target.value)}
                        placeholder="e.g. Lower floor, near window"
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] p-3.5 text-xs leading-relaxed text-[#4B5563]">
                    Note: Shown rent ({formatINR(selectedRoom?.monthlyRent || 0)}) and deposit (
                    {formatINR(selectedRoom?.securityDeposit || 0)}) are advertised rates. Final room number, bed, and charges are confirmed by the PG owner.
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload (Local Mock Previews Only) */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#111827]">
                      3. {t.stepDocuments}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Attach your photo and government ID. Demo files stay locally in this browser session only.
                    </p>
                  </div>

                  {/* Quick Mock Attach Buttons */}
                  <div className="space-y-3">
                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <p className="text-sm font-bold text-[#111827]">
                        1. Your Photograph (Required)
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            addMockDocument("photo", "Tenant Photograph", "camera_selfie.jpg")
                          }
                        >
                          <Camera className="h-4 w-4" />
                          Take Photo
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addMockDocument("photo", "Tenant Photograph", "gallery_photo.jpg")
                          }
                        >
                          <ImageIcon className="h-4 w-4" />
                          Choose From Gallery
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <p className="text-sm font-bold text-[#111827]">
                        2. Identity Proof — Aadhaar / Passport (Required)
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            addMockDocument(
                              "id_proof",
                              "Identity Proof (Aadhaar)",
                              "aadhaar_front_back.pdf"
                            )
                          }
                        >
                          <FileUp className="h-4 w-4" />
                          Upload File
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addMockDocument(
                              "id_proof",
                              "Identity Proof (Aadhaar)",
                              "aadhaar_photo_capture.jpg"
                            )
                          }
                        >
                          <Camera className="h-4 w-4" />
                          Take Photo of ID
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <p className="text-sm font-bold text-[#111827]">
                        3. Work / College ID (Optional)
                      </p>
                      <div className="mt-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addMockDocument("work_id", "Work / College ID", "company_id_card.pdf")
                          }
                        >
                          <FileUp className="h-4 w-4" />
                          Upload Work / College ID
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Attached Previews */}
                  {documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                        Attached Files ({documents.length})
                      </p>
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-xl border border-[#A7F3D0] bg-[#ECFDF5]/60 p-3"
                        >
                          <div className="flex items-center gap-3">
                            {doc.previewUrl ? (
                              <SafeImage
                                src={doc.previewUrl}
                                alt={doc.label}
                                className="h-10 w-10 rounded-lg"
                              />
                            ) : (
                              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#047857] text-white">
                                <FileUp className="h-5 w-5" />
                              </span>
                            )}
                            <div>
                              <p className="text-sm font-bold text-[#111827]">{doc.label}</p>
                              <p className="text-xs text-[#6B7280]">{doc.fileName}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDoc(doc.id)}
                            aria-label={`Remove ${doc.label}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#EF4444] hover:bg-[#FEE2E2] cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Emergency Contact */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#111827]">
                      4. {t.stepEmergency}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Someone the PG owner can call if there is ever an urgent situation.
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Relationship
                      </label>
                      <select
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-base"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Sibling">Brother / Sister</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Guardian">Guardian / Friend</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={emergencyMobile}
                        onChange={(e) => setEmergencyMobile(e.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#111827]">
                      5. {t.stepReview}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Check your information before sending it to {pg.ownerName}.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">Personal Details</span>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-semibold text-[#047857] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="mt-1.5 text-[#4B5563]">
                        {fullName} · {mobile} · {email}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">{occupation}</p>
                    </div>

                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">Room Choice</span>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs font-semibold text-[#047857] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="mt-1.5 text-[#4B5563]">
                        {pg.name} — {selectedRoom?.title} ({formatINR(selectedRoom?.monthlyRent || 0)}/mo)
                      </p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">
                        Move-in date: {expectedDate}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">Documents</span>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="text-xs font-semibold text-[#047857] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="mt-1.5 text-[#4B5563]">
                        {documents.map((d) => d.label).join(", ")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E5E7EB] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">Family Contact</span>
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          className="text-xs font-semibold text-[#047857] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="mt-1.5 text-[#4B5563]">
                        {emergencyName} ({emergencyRelation}) · {emergencyMobile}
                      </p>
                    </div>
                  </div>

                  <label className="flex min-h-[44px] items-start gap-2.5 rounded-xl bg-[#ECFDF5] p-3.5 text-xs leading-relaxed text-[#065F46] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rulesAccepted}
                      onChange={(e) => setRulesAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#047857]"
                    />
                    <span>
                      I have read the PG house rules and understand that my room, bed, and rent will be confirmed by the PG owner.
                    </span>
                  </label>
                </div>
              )}

              {formError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#FEE2E2] p-3 text-xs font-semibold text-[#991B1B]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setFormError("");
                    if (step === 1) {
                      setStartedForm(false);
                    } else {
                      setStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5);
                    }
                  }}
                >
                  Back
                </Button>

                {step < 5 ? (
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={handleNextStep}
                  >
                    Save & Continue
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={handleFinalSubmit}
                  >
                    {t.submitJoiningRequest}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
