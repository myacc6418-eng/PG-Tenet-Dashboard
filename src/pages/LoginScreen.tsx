import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BrandMark } from "@/src/components/shared/BrandMark";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberSession: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginDemoUser } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberSession: true,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginDemoUser(values.email);
    navigate(redirectTo, { replace: true });
  };

  const handleQuickDemoLogin = () => {
    setValue("email", "arjun.reddy@example.com");
    setValue("password", "DemoPass123");
    loginDemoUser("arjun.reddy@example.com");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/">
            <BrandMark size="lg" />
          </Link>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-[#111827]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            Sign in with your email to manage your PG stay or join a new PG.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xs sm:p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-[#111827]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-base text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-[#EF4444]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-[#111827]"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#047857] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="min-h-[48px] w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-12 text-base text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#047857] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-[#EF4444]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className="flex min-h-[44px] items-center gap-2.5 text-sm text-[#374151] cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberSession")}
                className="h-4 w-4 rounded border-[#D1D5DB] accent-[#047857]"
              />
              <span>Keep me signed in on this device</span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              Login
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-xs font-medium text-[#6B7280]">Demo Access</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleQuickDemoLogin}
          >
            Continue with Demo Account (Arjun Reddy)
          </Button>
          <p className="mt-2 text-center text-xs text-[#6B7280]">
            Uses an in-memory demo session. No real password is stored.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          New to PG Finder?{" "}
          <Link
            to={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-[#047857] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
