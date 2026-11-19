import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BrandMark } from "@/src/components/shared/BrandMark";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid email address"),
    mobile: z
      .string()
      .regex(/^[0-9+\s-]{10,15}$/, "Enter a valid 10-digit mobile number"),
    password: z
      .string()
      .min(8, "Use at least 8 characters with letters and numbers"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: "Please agree to the Terms and Privacy Policy",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [pendingUser, setPendingUser] = useState<{
    fullName: string;
    email: string;
    mobile: string;
  } | null>(null);
  const [otp, setOtp] = useState("482910");
  const [otpError, setOtpError] = useState("");
  const { registerDemoUser } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const strengthScore =
    (passwordValue.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(passwordValue) ? 1 : 0) +
    (/[0-9]/.test(passwordValue) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(passwordValue) ? 1 : 0);

  const strengthLabel =
    passwordValue.length === 0
      ? "Enter at least 8 characters"
      : strengthScore <= 1
      ? "Weak — add numbers or uppercase letters"
      : strengthScore === 2
      ? "Fair — add a number or symbol"
      : "Strong password";

  const onSubmit = (values: RegisterValues) => {
    setPendingUser({
      fullName: values.fullName,
      email: values.email,
      mobile: values.mobile,
    });
    setStep("verify");
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 4) {
      setOtpError("Please enter the 6-digit verification code.");
      return;
    }
    if (pendingUser) {
      registerDemoUser(pendingUser);
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/">
            <BrandMark size="md" />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-[#111827]">
            {step === "form" ? "Create your tenant account" : "Verify your email"}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {step === "form"
              ? "One account works across every PG you explore or live in."
              : `We sent a demo verification code to ${pendingUser?.email}`}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
          {step === "form" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arjun Reddy"
                  {...register("fullName")}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base text-[#111827] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs font-medium text-[#EF4444]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base text-[#111827] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-[#EF4444]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Mobile number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98490 55123"
                  {...register("mobile")}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base text-[#111827] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
                {errors.mobile && (
                  <p className="mt-1 text-xs font-medium text-[#EF4444]">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                    className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] pl-4 pr-12 text-base text-[#111827] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#6B7280] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((bar) => (
                    <span
                      key={bar}
                      className={`h-1.5 flex-1 rounded-full ${
                        strengthScore >= bar ? "bg-[#047857]" : "bg-[#E5E7EB]"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">{strengthLabel}</p>
                {errors.password && (
                  <p className="mt-1 text-xs font-medium text-[#EF4444]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] px-4 text-base text-[#111827] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-[#EF4444]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <label className="flex min-h-[44px] items-start gap-2.5 pt-1 text-xs leading-relaxed text-[#4B5563] cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="mt-0.5 h-4 w-4 rounded border-[#D1D5DB] accent-[#047857]"
                />
                <span>
                  I accept the PG Finder Terms of Service and Privacy Policy for tenant verification.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs font-medium text-[#EF4444]">
                  {errors.acceptTerms.message}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full">
                Continue to Email Verification
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmail} className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl bg-[#ECFDF5] p-3.5 text-sm text-[#065F46]">
                <Mail className="h-5 w-5 shrink-0 text-[#047857]" />
                <span>Demo verification code pre-filled for convenience.</span>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  6-digit verification code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError("");
                  }}
                  maxLength={6}
                  className="min-h-[52px] w-full rounded-xl border border-[#E5E7EB] px-4 text-center font-mono text-xl font-bold tracking-[0.35em] text-[#111827] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
                {otpError && (
                  <p className="mt-1.5 text-xs font-medium text-[#EF4444]">{otpError}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full">
                <CheckCircle2 className="h-5 w-5" />
                Verify & Create Account
              </Button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full py-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] cursor-pointer"
              >
                Edit registration details
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#047857] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
