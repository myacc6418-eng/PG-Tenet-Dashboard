import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, QrCode, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { BrandMark } from "@/src/components/shared/BrandMark";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { IMG } from "@/src/data/mockData";

const SLIDES = [
  {
    title: "Find Your Perfect PG",
    description:
      "Explore verified PGs near your office or college, compare room sharing options, and check real bed availability before you visit.",
    image: IMG.greenNestExt,
    icon: Search,
  },
  {
    title: "Everything About Your Stay",
    description:
      "Track monthly rent, check daily food menus, raise room maintenance requests, and keep your stay documents safe in one place.",
    image: IMG.onboarding,
    icon: ShieldCheck,
  },
  {
    title: "Move In With Ease",
    description:
      "Scan the PG owner's QR code to submit your details, receive room & bed confirmation, and check in smoothly with zero paperwork.",
    image: IMG.roomSingle,
    icon: QrCode,
  },
];

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const current = SLIDES[step];
  const Icon = current.icon;
  const isLast = step === SLIDES.length - 1;

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
        <BrandMark size="sm" />
        <button
          type="button"
          onClick={handleFinish}
          className="min-h-[44px] px-3 text-sm font-semibold text-[#6B7280] hover:text-[#111827] cursor-pointer"
        >
          Skip
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${step}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC]"
          >
            <SafeImage
              src={current.image}
              alt={current.title}
              fallbackLabel={current.title}
              className="aspect-[4/3] w-full"
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex flex-col justify-between lg:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`txt-${step}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22 }}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#047857]">
                <Icon className="h-5 w-5" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl text-balance">
                {current.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-2" aria-label="Onboarding progress">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setStep(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === step ? "w-8 bg-[#047857]" : "w-2.5 bg-[#E5E7EB]"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isLast ? (
                <Button size="lg" className="w-full" onClick={handleFinish}>
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
