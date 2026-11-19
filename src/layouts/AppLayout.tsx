import { Link, NavLink, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import { BrandMark } from "@/src/components/shared/BrandMark";
import { MobileBottomNav } from "@/src/components/shared/MobileBottomNav";
import { DemoScenarioBar } from "@/src/components/shared/DemoScenarioBar";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";
import { cn } from "@/src/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
  hideDesktopTopBar?: boolean;
}

export function AppLayout({
  children,
  hideBottomNav = false,
  hideDesktopTopBar = false,
}: AppLayoutProps) {
  const { t, tenantState } = useTenant();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: t.navHome, end: true },
    { to: "/explore", label: t.navExplore, end: false },
    { to: "/my-pg", label: t.navMyPg, end: false },
    { to: "/requests", label: t.navRequests, end: false },
    { to: "/profile", label: t.navProfile, end: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {!hideDesktopTopBar && (
        <header className="sticky top-0 z-40 hidden border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md lg:block">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
            <Link to="/" className="whitespace-nowrap shrink-0">
              <BrandMark size="md" />
            </Link>

            <nav
              aria-label="Desktop navigation"
              className="flex items-center gap-7 text-sm font-medium"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "whitespace-nowrap shrink-0 border-b-2 py-5 transition-colors",
                      isActive
                        ? "border-[#047857] font-semibold text-[#047857]"
                        : "border-transparent text-[#6B7280] hover:text-[#111827]"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="shrink-0">
              {tenantState === "logged_out" ? (
                <Button size="sm" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate("/join/pg-urban-oasis")}
                >
                  <QrCode className="h-4 w-4" />
                  Join via QR
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={cn("min-h-screen", !hideBottomNav && "pb-24 lg:pb-12")}>
        {children}
      </main>

      {!hideBottomNav && <MobileBottomNav />}
      <DemoScenarioBar />
    </div>
  );
}
