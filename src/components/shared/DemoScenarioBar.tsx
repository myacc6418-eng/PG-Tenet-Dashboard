import { useState } from "react";
import { QrCode, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileSheet } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";

const SCENARIOS = [
  { id: "active_resident", label: "Active PG Resident (Green Nest PG)" },
  { id: "no_pg", label: "Registered User Without a PG" },
  { id: "joining_pending", label: "Joining Request Pending" },
  { id: "joining_approved", label: "Joining Request Approved" },
  { id: "upcoming_checkin", label: "Upcoming Check-in" },
  { id: "checkout_pending", label: "Checkout Pending Owner Review" },
  { id: "checked_out", label: "Checked-Out Tenant (Ready to Re-join)" },
  { id: "logged_out", label: "Logged-out Visitor" },
] as const;

export function DemoScenarioBar() {
  const [open, setOpen] = useState(false);
  const { tenantState, switchDemoScenario } = useTenant();
  const navigate = useNavigate();

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-30 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#111827] shadow-md backdrop-blur-sm hover:border-[#047857] hover:text-[#047857] lg:bottom-6 lg:right-6 cursor-pointer"
        title="Development Demo State Switcher"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#047857]" />
        <span>Demo State</span>
      </button>

      <MobileSheet
        open={open}
        onOpenChange={setOpen}
        title="Demo Scenario Switcher"
        description="Development-only controls to preview every tenant lifecycle state and QR joining flow."
      >
        <div className="space-y-5">
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Tenant Lifecycle States
            </p>
            <div className="grid gap-2">
              {SCENARIOS.map((sc) => {
                const active = tenantState === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      switchDemoScenario(sc.id);
                      setOpen(false);
                    }}
                    className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                        : "border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span>{sc.label}</span>
                    {active && (
                      <span className="text-xs font-bold">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] pt-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Quick Flow Shortcuts
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/join/pg-urban-oasis");
                }}
              >
                <QrCode className="h-4 w-4 text-[#047857]" />
                Scan QR: Urban Oasis
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/join/pg-green-nest");
                }}
              >
                <QrCode className="h-4 w-4 text-[#047857]" />
                Scan QR: Green Nest
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/onboarding");
                }}
              >
                Preview Onboarding
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/splash");
                }}
              >
                Preview Splash
              </Button>
            </div>
          </div>
        </div>
      </MobileSheet>
    </>
  );
}
