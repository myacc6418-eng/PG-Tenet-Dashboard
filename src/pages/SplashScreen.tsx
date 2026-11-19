import { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding", { replace: true });
    }, 2400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white px-6 py-12 text-center">
      <div />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#047857] text-white shadow-lg shadow-[#047857]/20">
          <Home className="h-10 w-10" strokeWidth={2.2} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-[#111827]">
          PG Finder
        </h1>
        <p className="mt-2 max-w-xs text-sm text-[#6B7280]">
          Find verified PGs and manage your entire stay with ease.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/onboarding")}
          className="text-[#047857]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
