import { useState } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "@/src/components/shared/BrandMark";
import { Button } from "@/src/components/ui/button";

export function ForgotPasswordScreen() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("arjun.reddy@example.com");
  const [code, setCode] = useState("192837");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      setError("Enter the 6-digit verification code.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setStep(4);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandMark size="md" />
          <h1 className="mt-4 font-display text-2xl font-extrabold text-[#111827]">
            Reset your password
          </h1>
          <p className="mt-1 text-xs font-medium text-[#6B7280]">
            Frontend demonstration flow · Step {step} of 4
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <p className="text-sm text-[#4B5563]">
                Enter the email address registered with your PG Finder account.
              </p>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base text-[#111827] focus:border-[#047857] focus:outline-none"
                />
              </div>
              {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}
              <Button type="submit" size="lg" className="w-full">
                Send Verification Code
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <p className="text-sm text-[#4B5563]">
                Enter the 6-digit code sent to <span className="font-semibold text-[#111827]">{email}</span>.
              </p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="min-h-[52px] w-full rounded-xl border border-[#E5E7EB] px-4 text-center font-mono text-xl font-bold tracking-[0.35em] focus:border-[#047857] focus:outline-none"
              />
              {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}
              <Button type="submit" size="lg" className="w-full">
                Verify Code
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleNextStep3} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base focus:border-[#047857] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base focus:border-[#047857] focus:outline-none"
                />
              </div>
              {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}
              <Button type="submit" size="lg" className="w-full">
                Update Password
              </Button>
            </form>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#111827]">
                Password reset complete
              </h2>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                You can now sign in to your PG Finder account with your new password.
              </p>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </div>

        <Link
          to="/login"
          className="mt-6 inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:text-[#111827]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
