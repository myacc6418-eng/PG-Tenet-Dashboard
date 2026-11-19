import { Building2, ClipboardList, Compass, Home, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTenant } from "@/src/context/TenantContext";
import { cn } from "@/src/lib/utils";

export function MobileBottomNav() {
  const { t, joiningRequest, complaints, checkoutRequest } = useTenant();
  const activeAlertCount =
    (joiningRequest ? 1 : 0) +
    (checkoutRequest && checkoutRequest.status !== "Completed" ? 1 : 0) +
    complaints.filter((c) => c.status !== "Resolved").length;

  const items = [
    { to: "/", label: t.navHome, icon: Home, end: true },
    { to: "/explore", label: t.navExplore, icon: Compass, end: false },
    { to: "/my-pg", label: t.navMyPg, icon: Building2, end: false },
    {
      to: "/requests",
      label: t.navRequests,
      icon: ClipboardList,
      end: false,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
    },
    { to: "/profile", label: t.navProfile, icon: User, end: false },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E7EB] bg-white/95 backdrop-blur-md pb-safe lg:hidden"
    >
      <div className="mx-auto grid h-[60px] max-w-lg grid-cols-5 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "relative flex h-full min-w-[44px] flex-col items-center justify-center gap-0.5 px-1 transition-colors",
                  isActive ? "text-[#047857]" : "text-[#6B7280] hover:text-[#111827]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={isActive ? 2.4 : 1.9}
                    />
                    {item.badge !== undefined && (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#047857] px-1 text-[10px] font-bold text-white tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] leading-none whitespace-nowrap",
                      isActive ? "font-bold" : "font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
