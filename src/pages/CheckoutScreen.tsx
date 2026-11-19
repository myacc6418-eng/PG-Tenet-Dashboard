import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  LifeBuoy,
  LogOut,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "@/src/components/shared/EmptyState";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { RequestTimeline, TimelineStep } from "@/src/components/shared/RequestTimeline";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useTenant } from "@/src/context/TenantContext";
import { formatDateShort, formatINR } from "@/src/lib/utils";

export function CheckoutScreen() {
  const {
    tenantState,
    activeStay,
    checkoutRequest,
    payments,
    submitCheckoutRequest,
    simulateApproveCheckout,
    t,
  } = useTenant();
  const navigate = useNavigate();

  const [requestedDate, setRequestedDate] = useState("2026-12-18");
  const [reason, setReason] = useState("Relocating closer to new office");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Checked-out completed state
  if (tenantState === "checked_out" || (checkoutRequest && checkoutRequest.status === "Completed")) {
    return (
      <div className="pb-16">
        <PageHeader title="Checkout Complete" subtitle="Ready to join a new PG" />
        <div className="mx-auto mt-6 max-w-2xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[#A7F3D0] bg-white p-6 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-[#111827]">
              Checkout Approved & Completed
            </h2>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Your stay has been closed and moved to your Stay History. You can now join any new PG using Explore or QR scan.
            </p>

            {checkoutRequest?.ownerApproval && (
              <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Final Checkout Date</span>
                  <span className="font-bold text-[#111827]">
                    {formatDateShort(checkoutRequest.ownerApproval.finalCheckoutDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Final Charges</span>
                  <span className="font-bold text-[#111827] tabular-nums">
                    {formatINR(checkoutRequest.ownerApproval.finalCharges)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Deposit Settlement</span>
                  <span className="font-bold text-[#047857]">
                    {checkoutRequest.ownerApproval.settlementStatus}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={() => navigate("/explore")}>
                Explore New PGs
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/profile")}
              >
                View Stay History
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeStay) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <EmptyState
          icon={LogOut}
          title="No active PG stay"
          description="You are not currently staying in any PG."
          actionLabel="Explore PGs"
          actionTo="/explore"
        />
      </div>
    );
  }

  const pendingRent = payments
    .filter((p) => p.status !== "Paid")
    .reduce((acc, p) => acc + (p.totalAmount - p.paidAmount), 0);

  const checkoutSteps: TimelineStep[] = [
    {
      title: "Checkout Request Sent",
      subtitle: checkoutRequest
        ? `Submitted on ${formatDateShort(checkoutRequest.submittedAt)}`
        : "",
      state: "done",
    },
    {
      title: "Owner Checking Room & Deposit",
      subtitle: "Your checkout request is being reviewed.",
      state: checkoutRequest?.status === "Under Review" ? "current" : "done",
    },
    {
      title: "Final Settlement & Confirmation",
      subtitle: "Owner confirms final charges and deposit refund before closing stay.",
      state: "upcoming",
    },
  ];

  return (
    <div className="pb-16">
      <PageHeader title={t.requestCheckout} subtitle={activeStay.pgName} />

      <div className="mx-auto mt-5 max-w-3xl space-y-5 px-4 sm:px-6">
        {checkoutRequest ? (
          /* PENDING CHECKOUT TRACKER */
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#FDE68A] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <StatusBadge label="Checkout Under Review" tone="warning" />
                  <h2 className="mt-2.5 font-display text-xl font-bold text-[#111827]">
                    Your checkout request is being reviewed.
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Requested move-out: {formatDateShort(checkoutRequest.requestedCheckoutDate)} ·{" "}
                    {checkoutRequest.roomNumber}, {checkoutRequest.bedNumber}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <RequestTimeline steps={checkoutSteps} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#F8FAFC] p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#6B7280]">Pending Rent</p>
                  <p className="font-bold text-[#111827] tabular-nums">
                    {formatINR(checkoutRequest.pendingRent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Deposit Held</p>
                  <p className="font-bold text-[#111827] tabular-nums">
                    {formatINR(checkoutRequest.depositAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Est. Refund</p>
                  <p className="font-bold text-[#047857] tabular-nums">
                    {formatINR(checkoutRequest.refundableDeposit)}
                  </p>
                </div>
              </div>

              {/* Delayed Checkout Actions */}
              <div className="mt-5 border-t border-[#F1F5F9] pt-4">
                <p className="mb-2.5 text-xs font-semibold text-[#6B7280]">
                  Need a faster response from the PG owner?
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      toast.info(`Calling ${activeStay.ownerName}: ${activeStay.ownerPhone}`)
                    }
                  >
                    <Phone className="h-4 w-4" />
                    Contact Owner
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.success("Support ticket raised with PG Finder team", {
                        description: "We will follow up with the PG owner within 4 hours.",
                      })
                    }
                  >
                    <LifeBuoy className="h-4 w-4" />
                    Raise Support Issue
                  </Button>
                </div>
              </div>
            </section>

            {/* Demo-Only Owner Approval Simulation */}
            <section className="rounded-2xl border border-dashed border-[#047857] bg-[#ECFDF5]/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#047857]">
                Demo Simulation Only — PG Owner Dashboard Action
              </p>
              <p className="mt-1 text-sm text-[#065F46]">
                In production, the PG owner reviews your room & settles your deposit before closing your stay. Simulate owner approval below to test joining a new PG.
              </p>
              <Button className="mt-3" onClick={simulateApproveCheckout}>
                Simulate Owner Checkout Approval
              </Button>
            </section>
          </div>
        ) : (
          /* SUBMIT CHECKOUT FORM */
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#111827]">
                Current Stay Summary
              </h2>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F8FAFC] p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#6B7280]">PG & Room</p>
                  <p className="font-bold text-[#111827]">
                    {activeStay.pgName} · {activeStay.roomNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Check-in Date</p>
                  <p className="font-bold text-[#111827]">
                    {formatDateShort(activeStay.checkInDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Notice Period</p>
                  <p className="font-bold text-[#111827]">30 days</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Pending Rent</p>
                  <p className="font-bold text-[#EF4444] tabular-nums">
                    {formatINR(pendingRent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Deposit Held</p>
                  <p className="font-bold text-[#047857] tabular-nums">
                    {formatINR(activeStay.securityDeposit)}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Requested Checkout Date
                </label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Reason for Leaving
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm"
                >
                  <option value="Relocating closer to new office">
                    Relocating closer to new office
                  </option>
                  <option value="Moving to a different city">
                    Moving to a different city
                  </option>
                  <option value="Shifting to a flat / apartment">
                    Shifting to a flat / apartment
                  </option>
                  <option value="Course / internship completed">
                    Course / internship completed
                  </option>
                  <option value="Personal reasons">Personal reasons</option>
                </select>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-[#FFFBEB] p-3.5 text-xs text-[#92400E]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Submitting a request notifies your PG owner. Your active stay ends only after the owner reviews and confirms checkout.
                </span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => setConfirmOpen(true)}
              >
                Submit Checkout Request
              </Button>
            </section>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Checkout Request</DialogTitle>
            <DialogDescription>
              Requesting move-out from {activeStay.pgName} on{" "}
              {formatDateShort(requestedDate)}.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-[#4B5563]">
            The PG owner will review pending rent ({formatINR(pendingRent)}) and your security deposit ({formatINR(activeStay.securityDeposit)}) before approving.
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                submitCheckoutRequest(requestedDate, reason);
                setConfirmOpen(false);
              }}
            >
              Confirm & Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
