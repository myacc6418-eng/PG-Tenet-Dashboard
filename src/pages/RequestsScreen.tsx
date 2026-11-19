import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  Plus,
  Wrench,
  Camera,
} from "lucide-react";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { RequestTimeline, TimelineStep } from "@/src/components/shared/RequestTimeline";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useTenant } from "@/src/context/TenantContext";
import { formatDateShort, formatINR } from "@/src/lib/utils";
import { ComplaintCategory } from "@/src/types";

const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  "Electricity",
  "Plumbing",
  "Wi-Fi",
  "Cleaning",
  "Furniture",
  "Food",
  "Other",
];

export function RequestsScreen() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "complaints" ? "complaints" : "joining";

  const {
    tenantState,
    joiningRequest,
    checkoutRequest,
    complaints,
    visits,
    resubmitCorrection,
    acceptApprovedTerms,
    simulateJoiningStatus,
    simulateCheckInComplete,
    createComplaint,
    simulateResolveComplaint,
  } = useTenant();

  const [newComplaintOpen, setNewComplaintOpen] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory>("Wi-Fi");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoLabel, setPhotoLabel] = useState("");

  // Correction state
  const [correctionPhone, setCorrectionPhone] = useState(
    joiningRequest?.personalDetails.mobile || ""
  );
  const [correctionOccupation, setCorrectionOccupation] = useState(
    joiningRequest?.personalDetails.occupation || ""
  );

  const joiningSteps: TimelineStep[] = joiningRequest
    ? [
        {
          title: "Request Sent",
          subtitle: `Submitted on ${formatDateShort(joiningRequest.submittedAt)}`,
          state: "done",
        },
        {
          title: "Owner Checking Details",
          subtitle:
            joiningRequest.status === "More Details Required"
              ? "Owner asked for an update to your details."
              : "The PG owner is checking your details.",
          state:
            joiningRequest.status === "Submitted"
              ? "current"
              : joiningRequest.status === "More Details Required"
              ? "warning"
              : "done",
        },
        {
          title: "Room & Bed Confirmed",
          subtitle:
            joiningRequest.status === "Approved" ||
            joiningRequest.status === "Upcoming Check-in" ||
            joiningRequest.status === "Active"
              ? `${joiningRequest.confirmedTerms?.assignedRoomNumber}, ${joiningRequest.confirmedTerms?.assignedBedNumber}`
              : "Waiting for owner confirmation",
          state:
            joiningRequest.status === "Approved"
              ? "current"
              : joiningRequest.status === "Upcoming Check-in" ||
                joiningRequest.status === "Active"
              ? "done"
              : "upcoming",
        },
        {
          title: "Check-in & Stay Active",
          subtitle:
            joiningRequest.status === "Upcoming Check-in"
              ? "Terms accepted. Ready to move in."
              : joiningRequest.status === "Active"
              ? "Checked in!"
              : "Pending terms acceptance",
          state:
            joiningRequest.status === "Upcoming Check-in"
              ? "current"
              : joiningRequest.status === "Active"
              ? "done"
              : "upcoming",
        },
      ]
    : [];

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    createComplaint({
      category,
      title: title.trim(),
      description: description.trim(),
      photoLabel: photoLabel || undefined,
    });
    setTitle("");
    setDescription("");
    setPhotoLabel("");
    setNewComplaintOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-5 pb-12 sm:px-6 lg:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#111827]">
            Requests & Help
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Track joining status, room maintenance, and scheduled PG visits.
          </p>
        </div>

        <Button onClick={() => setNewComplaintOpen(true)}>
          <Plus className="h-4 w-4" />
          New Complaint
        </Button>
      </div>

      <Tabs defaultValue={initialTab} className="mt-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="joining">Joining & Checkout</TabsTrigger>
          <TabsTrigger value="complaints">
            Maintenance ({complaints.length})
          </TabsTrigger>
          <TabsTrigger value="visits">Visits ({visits.length})</TabsTrigger>
        </TabsList>

        {/* JOINING & CHECKOUT TAB */}
        <TabsContent value="joining" className="space-y-5">
          {checkoutRequest && (
            <div className="rounded-2xl border border-[#FDE68A] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <StatusBadge
                    label={`Checkout: ${checkoutRequest.status}`}
                    tone={checkoutRequest.status === "Completed" ? "success" : "warning"}
                  />
                  <h2 className="mt-2 font-display text-lg font-bold text-[#111827]">
                    {checkoutRequest.pgName} · {checkoutRequest.roomNumber}
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Requested move-out: {formatDateShort(checkoutRequest.requestedCheckoutDate)}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link to="/my-pg/checkout">Open Checkout Tracker</Link>
                </Button>
              </div>
            </div>
          )}

          {joiningRequest ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F1F5F9] pb-4">
                  <div>
                    <StatusBadge
                      label={joiningRequest.status}
                      tone={
                        joiningRequest.status === "Approved" ||
                        joiningRequest.status === "Upcoming Check-in" ||
                        joiningRequest.status === "Active"
                          ? "success"
                          : joiningRequest.status === "More Details Required"
                          ? "warning"
                          : joiningRequest.status === "Rejected"
                          ? "error"
                          : "info"
                      }
                    />
                    <h2 className="mt-2 font-display text-xl font-bold text-[#111827]">
                      {joiningRequest.pgName}
                    </h2>
                    <p className="text-sm text-[#6B7280]">
                      {joiningRequest.roomTitle} · {joiningRequest.pgLocation}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#6B7280]">Expected Move-in</p>
                    <p className="text-sm font-bold text-[#111827]">
                      {formatDateShort(joiningRequest.expectedCheckInDate)}
                    </p>
                  </div>
                </div>

                {joiningRequest.ownerNote && (
                  <p className="mt-4 rounded-xl bg-[#F8FAFC] p-3.5 text-sm text-[#374151]">
                    {joiningRequest.ownerNote}
                  </p>
                )}

                <div className="mt-5">
                  <RequestTimeline steps={joiningSteps} />
                </div>

                {/* Correction Box if More Details Required */}
                {joiningRequest.status === "More Details Required" && (
                  <div className="mt-5 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 space-y-3">
                    <h3 className="text-sm font-bold text-[#92400E]">
                      Update Requested Details
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#111827]">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={correctionPhone}
                          onChange={(e) => setCorrectionPhone(e.target.value)}
                          className="min-h-[44px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#111827]">
                          Work / College Name
                        </label>
                        <input
                          type="text"
                          value={correctionOccupation}
                          onChange={(e) => setCorrectionOccupation(e.target.value)}
                          className="min-h-[44px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        resubmitCorrection(
                          "Updated mobile & occupation",
                          correctionPhone,
                          correctionOccupation
                        )
                      }
                    >
                      Resubmit Details
                    </Button>
                  </div>
                )}

                {/* Approved Terms Review & Acceptance */}
                {joiningRequest.status === "Approved" &&
                  joiningRequest.confirmedTerms && (
                    <div className="mt-5 rounded-2xl border border-[#047857] bg-[#ECFDF5]/60 p-5">
                      <h3 className="font-display text-lg font-bold text-[#111827]">
                        Confirmed Room & Stay Terms
                      </h3>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-xs text-[#6B7280]">Assigned Room</p>
                          <p className="font-bold text-[#111827]">
                            {joiningRequest.confirmedTerms.assignedRoomNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Bed Number</p>
                          <p className="font-bold text-[#111827]">
                            {joiningRequest.confirmedTerms.assignedBedNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Joining Date</p>
                          <p className="font-bold text-[#111827]">
                            {formatDateShort(
                              joiningRequest.confirmedTerms.confirmedCheckInDate
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Confirmed Rent</p>
                          <p className="font-bold text-[#047857] tabular-nums">
                            {formatINR(joiningRequest.confirmedTerms.confirmedRent)}/mo
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Security Deposit</p>
                          <p className="font-bold text-[#111827] tabular-nums">
                            {formatINR(joiningRequest.confirmedTerms.confirmedDeposit)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[#374151]">
                        {joiningRequest.confirmedTerms.agreementSummary}
                      </p>
                      <Button
                        size="lg"
                        className="mt-4 w-full"
                        onClick={acceptApprovedTerms}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Accept Confirmed Terms & Proceed to Check-in
                      </Button>
                    </div>
                  )}

                {joiningRequest.status === "Upcoming Check-in" && (
                  <div className="mt-5 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#065F46]">
                        Check-in confirmed for{" "}
                        {formatDateShort(joiningRequest.expectedCheckInDate)}
                      </p>
                      <p className="text-xs text-[#047857]">
                        Show your joining confirmation at the PG desk on arrival.
                      </p>
                    </div>
                    {import.meta.env.DEV && (
                      <Button size="sm" onClick={simulateCheckInComplete}>
                        Demo: Complete Check-in
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Dev-only Owner Simulation Panel */}
              {import.meta.env.DEV &&
                joiningRequest.status !== "Active" &&
                joiningRequest.status !== "Upcoming Check-in" && (
                  <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Demo Only: Simulate PG Owner Action
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => simulateJoiningStatus("Under Review")}
                      >
                        Mark Under Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => simulateJoiningStatus("More Details Required")}
                      >
                        Ask for Correction
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => simulateJoiningStatus("Approved")}
                      >
                        Approve Joining Request
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          ) : !checkoutRequest ? (
            <EmptyState
              icon={ClipboardList}
              title="No active joining requests"
              description={
                tenantState === "active_resident"
                  ? "You are currently an active resident. You can raise maintenance requests or check your stay details from My PG."
                  : "Browse PGs or scan a PG owner's QR code to submit your joining request."
              }
              actionLabel={
                tenantState === "active_resident" ? "Go to My PG" : "Explore PGs"
              }
              actionTo={tenantState === "active_resident" ? "/my-pg" : "/explore"}
            />
          ) : null}
        </TabsContent>

        {/* COMPLAINTS & MAINTENANCE TAB */}
        <TabsContent value="complaints" className="space-y-4">
          {complaints.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No maintenance issues raised"
              description="Everything in your room looks good. Need a quick repair? Tap New Complaint above."
              actionLabel="Raise Complaint"
              onAction={() => setNewComplaintOpen(true)}
            />
          ) : (
            complaints.map((cmp) => (
              <article
                key={cmp.id}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[#047857]">
                      {cmp.category} · {formatDateShort(cmp.createdAt)}
                    </span>
                    <h3 className="mt-1 font-display text-base font-bold text-[#111827]">
                      {cmp.title}
                    </h3>
                  </div>
                  <StatusBadge
                    label={cmp.status}
                    tone={
                      cmp.status === "Resolved"
                        ? "success"
                        : cmp.status === "In Progress"
                        ? "warning"
                        : "info"
                    }
                  />
                </div>
                <p className="mt-2 text-sm text-[#4B5563]">{cmp.description}</p>
                {cmp.photoLabel && (
                  <p className="mt-2 text-xs text-[#6B7280]">
                    Attached photo: {cmp.photoLabel}
                  </p>
                )}
                {cmp.resolutionNote && (
                  <div className="mt-3 rounded-xl bg-[#F8FAFC] p-3 text-xs text-[#374151]">
                    <span className="font-bold">Caretaker Update: </span>
                    {cmp.resolutionNote}
                  </div>
                )}
                {import.meta.env.DEV && cmp.status !== "Resolved" && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateResolveComplaint(cmp.id)}
                    >
                      Demo: Mark Resolved
                    </Button>
                  </div>
                )}
              </article>
            ))
          )}
        </TabsContent>

        {/* SCHEDULED VISITS TAB */}
        <TabsContent value="visits" className="space-y-4">
          {visits.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No scheduled PG visits"
              description="Tap Schedule Visit on any PG listing to book an in-person tour."
              actionLabel="Find a PG"
              actionTo="/explore"
            />
          ) : (
            visits.map((v) => (
              <div
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5"
              >
                <div>
                  <StatusBadge label={v.status} tone="info" />
                  <h3 className="mt-2 font-display text-base font-bold text-[#111827]">
                    {v.pgName}
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {v.pgLocation} · {formatDateShort(v.date)} ({v.timeSlot})
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/pg/${v.pgId}`}>View PG</Link>
                </Button>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* New Complaint Sheet */}
      <MobileSheet
        open={newComplaintOpen}
        onOpenChange={setNewComplaintOpen}
        title="Report Room or PG Issue"
        description="Tell the caretaker what needs fixing."
      >
        <form onSubmit={handleSubmitComplaint} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#111827]">Category</p>
            <div className="flex flex-wrap gap-2">
              {COMPLAINT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`min-h-[40px] rounded-xl border px-3.5 text-xs font-semibold cursor-pointer ${
                    category === cat
                      ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                      : "border-[#E5E7EB] bg-white text-[#374151]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
              Short Summary
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bathroom light flickering"
              className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
              Details
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention your room number and what happened..."
              className="w-full rounded-xl border border-[#E5E7EB] p-3.5 text-sm"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3">
            <span className="text-xs text-[#4B5563]">
              {photoLabel ? `Attached: ${photoLabel}` : "Optional photo of the issue"}
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setPhotoLabel(`issue_${Date.now().toString().slice(-4)}.jpg`)}
            >
              <Camera className="h-4 w-4" />
              Attach Photo
            </Button>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Submit Complaint
          </Button>
        </form>
      </MobileSheet>
    </div>
  );
}
