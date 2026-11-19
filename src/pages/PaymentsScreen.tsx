import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Download,
  IndianRupee,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useTenant } from "@/src/context/TenantContext";
import { formatDateShort, formatINR } from "@/src/lib/utils";
import { RentPayment } from "@/src/types";

export function PaymentsScreen() {
  const { payments, activeStay, payRentMock } = useTenant();
  const [payingItem, setPayingItem] = useState<RentPayment | null>(null);
  const [payMethod, setPayMethod] = useState<"UPI" | "Card" | "Netbanking">("UPI");
  const [receiptItem, setReceiptItem] = useState<RentPayment | null>(null);

  const currentBill = payments[0];
  const pendingTotal = payments.reduce(
    (sum, p) => sum + Math.max(0, p.totalAmount - p.paidAmount),
    0
  );

  const handleConfirmDemoPay = () => {
    if (!payingItem) return;
    payRentMock(payingItem.id, payMethod);
    setPayingItem(null);
  };

  const handleDownloadReceiptText = (p: RentPayment) => {
    const content = [
      `PG FINDER — DEMO RENT RECEIPT`,
      `====================================`,
      `Property: ${activeStay?.pgName || "Green Nest PG"}`,
      `Room & Bed: ${activeStay?.roomNumber || "Room 204"} · ${activeStay?.bedNumber || "Bed B"}`,
      `Billing Month: ${p.monthLabel}`,
      `Base Rent: ${formatINR(p.rentAmount)}`,
      `Electricity Charge: ${formatINR(p.electricityCharge)}`,
      `Total Paid: ${formatINR(p.paidAmount)}`,
      `Payment Date: ${p.paidDate || "-"}`,
      `Reference: ${p.transactionRef || "DEMO-REF"}`,
      `Note: Demonstration receipt generated in frontend prototype.`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PGFinder-Receipt-${p.monthLabel.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-16">
      <PageHeader title="Rent & Payments" subtitle={activeStay?.pgName || "My PG"} />

      <div className="mx-auto mt-5 max-w-4xl space-y-6 px-4 sm:px-6">
        {/* Fintech Overview Card */}
        {currentBill && (
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  {currentBill.monthLabel} Statement
                </p>
                <p className="mt-1 font-display text-3xl font-extrabold text-[#111827] tabular-nums sm:text-4xl">
                  {formatINR(pendingTotal > 0 ? pendingTotal : currentBill.totalAmount)}
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Due date: {formatDateShort(currentBill.dueDate)}
                </p>
              </div>
              <StatusBadge
                label={pendingTotal > 0 ? "Pending Payment" : "All Paid"}
                tone={pendingTotal > 0 ? "warning" : "success"}
              />
            </div>

            {/* Breakdown */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#F1F5F9] pt-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-[#6B7280]">Monthly Rent</p>
                <p className="mt-0.5 font-bold text-[#111827] tabular-nums">
                  {formatINR(currentBill.rentAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Electricity</p>
                <p className="mt-0.5 font-bold text-[#111827] tabular-nums">
                  {formatINR(currentBill.electricityCharge)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Amount Paid</p>
                <p className="mt-0.5 font-bold text-[#047857] tabular-nums">
                  {formatINR(currentBill.paidAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Deposit Held</p>
                <p className="mt-0.5 font-bold text-[#111827] tabular-nums">
                  {formatINR(activeStay?.securityDeposit || 8500)}
                </p>
              </div>
            </div>

            {currentBill.status !== "Paid" && (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => setPayingItem(currentBill)}
                >
                  <IndianRupee className="h-4 w-4" />
                  Pay Rent ({formatINR(currentBill.totalAmount - currentBill.paidAmount)})
                </Button>
                <p className="text-xs text-[#6B7280]">
                  Demo checkout only — no real bank transaction occurs.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Payment History */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="font-display text-lg font-bold text-[#111827]">
            Payment History
          </h2>
          <div className="mt-4 divide-y divide-[#F1F5F9]">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm font-bold text-[#111827]">{p.monthLabel}</p>
                    <StatusBadge
                      label={p.status}
                      tone={p.status === "Paid" ? "success" : "warning"}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280]">
                    Rent {formatINR(p.rentAmount)} + Electricity{" "}
                    {formatINR(p.electricityCharge)}
                    {p.paidDate ? ` · Paid ${formatDateShort(p.paidDate)}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-display text-base font-bold text-[#111827] tabular-nums">
                    {formatINR(p.totalAmount)}
                  </span>
                  {p.status === "Paid" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReceiptItem(p)}
                    >
                      <Download className="h-4 w-4" />
                      Receipt
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setPayingItem(p)}>
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mock Payment Sheet */}
      <MobileSheet
        open={Boolean(payingItem)}
        onOpenChange={(open) => !open && setPayingItem(null)}
        title="Demo Rent Payment"
        description="Frontend simulation — no real money will be charged."
      >
        {payingItem && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#ECFDF5] p-4">
              <p className="text-xs font-semibold text-[#065F46]">
                Paying for {payingItem.monthLabel}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#047857] tabular-nums">
                {formatINR(payingItem.totalAmount - payingItem.paidAmount)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-[#111827]">
                Select Payment Mode (Demo)
              </p>
              <div className="space-y-2">
                {[
                  { id: "UPI" as const, label: "UPI App (GPay / PhonePe / Paytm)", icon: Smartphone },
                  { id: "Card" as const, label: "Debit / Credit Card", icon: CreditCard },
                  { id: "Netbanking" as const, label: "Netbanking", icon: ShieldCheck },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`flex min-h-[50px] w-full items-center gap-3 rounded-xl border px-4 text-left text-sm font-semibold cursor-pointer ${
                        payMethod === m.id
                          ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                          : "border-[#E5E7EB] bg-white text-[#111827]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleConfirmDemoPay}>
              <CheckCircle2 className="h-5 w-5" />
              Simulate Payment ({formatINR(payingItem.totalAmount - payingItem.paidAmount)})
            </Button>
          </div>
        )}
      </MobileSheet>

      {/* Receipt Preview Dialog */}
      <Dialog
        open={Boolean(receiptItem)}
        onOpenChange={(open) => !open && setReceiptItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rent Receipt — {receiptItem?.monthLabel}</DialogTitle>
            <DialogDescription>
              Demonstration receipt for your records
            </DialogDescription>
          </DialogHeader>
          {receiptItem && (
            <div className="mt-2 space-y-4 text-sm">
              <div className="rounded-xl bg-[#F8FAFC] p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">PG Property</span>
                  <span className="font-semibold text-[#111827]">
                    {activeStay?.pgName || "Green Nest PG"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Room & Bed</span>
                  <span className="font-semibold text-[#111827]">
                    {activeStay?.roomNumber} · {activeStay?.bedNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Rent + Electricity</span>
                  <span className="font-semibold text-[#111827] tabular-nums">
                    {formatINR(receiptItem.rentAmount)} +{" "}
                    {formatINR(receiptItem.electricityCharge)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E5E7EB] pt-2">
                  <span className="font-bold text-[#111827]">Total Paid</span>
                  <span className="font-bold text-[#047857] tabular-nums">
                    {formatINR(receiptItem.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>Reference</span>
                  <span className="font-mono">{receiptItem.transactionRef}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleDownloadReceiptText(receiptItem)}
              >
                <Download className="h-4 w-4" />
                Download Receipt File
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
