"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, Smartphone } from "lucide-react";
import { Suspense, useRef, useState, type ClipboardEvent, type FormEvent, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";

import { PageShell } from "@/components/admin/layout/page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { appToast } from "@/components/ui/sonner";
import { useLoginMutation } from "@/hooks/mutations/use-auth-mutations";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/constants/site";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/services/api-client";

const AUTH_FLOW_KEY = "ddm_auth_flow";

type AuthFlowState = {
  mobile: string;
  purpose: "LOGIN" | "REGISTER" | "RESET_PASSWORD";
  verificationToken?: string;
};

function readAuthFlow(): AuthFlowState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(AUTH_FLOW_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthFlowState;
  } catch {
    return null;
  }
}

function writeAuthFlow(state: AuthFlowState) {
  sessionStorage.setItem(AUTH_FLOW_KEY, JSON.stringify(state));
}

function isMobile(value: string) {
  return /^\+?[0-9]{7,20}$/.test(value.replace(/\s/g, ""));
}

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

function AuthShell({ children, description, eyebrow, title }: AuthShellProps) {
  return (
    <PageShell centered>
      <section aria-labelledby="auth-title" className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl gradient-saffron-gold text-primary-foreground shadow-premium">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            {siteConfig.company}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight" id="auth-title">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <Card className="glass-panel shadow-premium">
          <CardHeader>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </section>
    </PageShell>
  );
}

function isEmailOrMobile(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[6-9]\d{9}$/.test(value);
}

export function LoginFormContent() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const login = useLoginMutation();

  const identifierError = submitted && !isEmailOrMobile(identifier) ? "Enter a valid email or mobile number." : "";
  const passwordError = submitted && password.length < 8 ? "Password must be at least 8 characters." : "";
  const valid = isEmailOrMobile(identifier) && password.length >= 8;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!valid || login.isPending) return;

    login.mutate({ identifier: identifier.trim(), password });
  }

  return (
    <AuthShell
      description="Sign in to continue to the DevDarshanMarg admin console."
      eyebrow="Secure access"
      title="Sign in"
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        {login.isError ? (
          <Alert
            description={login.error?.message ?? "Unable to sign in."}
            title="Sign in failed"
            variant="destructive"
          />
        ) : null}
        <Input
          autoComplete="username"
          disabled={login.isPending}
          error={identifierError}
          label="Email or mobile"
          leftIcon={<Mail />}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="admin@example.com or 9876543210"
          required
          value={identifier}
        />
        <PasswordInput
          autoComplete="current-password"
          description="Use your admin password."
          disabled={login.isPending}
          error={passwordError}
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          required
          value={password}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Checkbox
            checked={remember}
            disabled={login.isPending}
            label="Remember me"
            onCheckedChange={(checked) => setRemember(Boolean(checked))}
          />
          <Link className="text-sm font-medium text-primary hover:underline" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <Button fullWidth loading={login.isPending} type="submit">
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<PageShell centered><div className="text-center text-sm text-muted-foreground">Loading sign in...</div></PageShell>}>
      <LoginFormContent />
    </Suspense>
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const error = submitted && !isMobile(mobile) ? "Enter a valid mobile number." : "";
  const forgotPassword = useMutation({
    mutationFn: () => authService.forgotPassword({ mobile: mobile.trim() }),
    onSuccess: () => {
      writeAuthFlow({ mobile: mobile.trim(), purpose: "RESET_PASSWORD" });
      appToast.success("OTP sent", "Check your mobile for the reset code.");
      router.push("/otp-verification");
    },
    onError: (err) => appToast.error("Failed to send OTP", getApiErrorMessage(err)),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!isMobile(mobile) || forgotPassword.isPending) return;
    forgotPassword.mutate();
  }

  return (
    <AuthShell
      description="Request a one-time password to reset your account password."
      eyebrow="Password recovery"
      title="Forgot password"
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <Input
          error={error}
          label="Mobile"
          leftIcon={<Smartphone />}
          onChange={(event) => setMobile(event.target.value)}
          placeholder="+919876543210"
          required
          value={mobile}
        />
        <Button fullWidth loading={forgotPassword.isPending} type="submit">
          Send OTP
        </Button>
      </form>
    </AuthShell>
  );
}

export function OtpVerificationForm() {
  const router = useRouter();
  const flow = readAuthFlow();
  const [otp, setOtp] = useState(Array<string>(6).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const complete = otp.every(Boolean);
  const verifyOtp = useMutation({
    mutationFn: () =>
      authService.verifyOtp({
        mobile: flow?.mobile ?? "",
        otp: otp.join(""),
        purpose: flow?.purpose ?? "RESET_PASSWORD",
      }),
    onSuccess: (data) => {
      const token =
        data && typeof data === "object" && "verificationToken" in data
          ? String((data as { verificationToken: string }).verificationToken)
          : "";
      if (flow && token) {
        writeAuthFlow({ ...flow, verificationToken: token });
      }
      appToast.success("OTP verified");
      router.push("/reset-password");
    },
    onError: (err) => appToast.error("OTP verification failed", getApiErrorMessage(err)),
  });

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    setOtp(Array.from({ length: 6 }, (_, index) => digits[index] ?? ""));
    inputs.current[Math.min(digits.length, 5)]?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete || !flow?.mobile || verifyOtp.isPending) return;
    verifyOtp.mutate();
  }

  return (
    <AuthShell
      description={`Enter the 6 digit OTP sent to ${flow?.mobile ?? "your mobile"}.`}
      eyebrow="OTP verification"
      title="Verify OTP"
    >
      {!flow?.mobile ? (
        <Alert description="Start from forgot password to request an OTP." title="No OTP session" variant="warning" />
      ) : null}
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <div aria-label="6 digit OTP" className="grid grid-cols-6 gap-2" role="group">
          {otp.map((digit, index) => (
            <input
              aria-label={`OTP digit ${index + 1}`}
              className="h-12 rounded-xl border border-input bg-background text-center text-lg font-semibold outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/40"
              inputMode="numeric"
              key={index}
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
              }}
              onPaste={handlePaste}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              value={digit}
            />
          ))}
        </div>
        <Button disabled={!complete || !flow?.mobile} fullWidth loading={verifyOtp.isPending} type="submit">
          Verify and continue
        </Button>
      </form>
    </AuthShell>
  );
}

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const flow = readAuthFlow();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const strength = passwordStrength(password);
  const mismatch = confirmPassword && password !== confirmPassword;
  const resetPassword = useMutation({
    mutationFn: () =>
      authService.resetPassword({
        verificationToken: flow?.verificationToken ?? "",
        newPassword: password,
      }),
    onSuccess: () => {
      sessionStorage.removeItem(AUTH_FLOW_KEY);
      appToast.success("Password reset successfully");
      router.push("/login");
    },
    onError: (err) => appToast.error("Password reset failed", getApiErrorMessage(err)),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || mismatch || strength < 2 || !flow?.verificationToken || resetPassword.isPending) return;
    resetPassword.mutate();
  }

  return (
    <AuthShell
      description="Create a new password for your admin account."
      eyebrow="Reset credentials"
      title="Reset password"
    >
      {!flow?.verificationToken ? (
        <Alert description="Verify OTP before resetting your password." title="Verification required" variant="warning" />
      ) : null}
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <PasswordInput
          autoComplete="new-password"
          description="Use 8+ characters with uppercase, number, and symbol."
          label="New password"
          onChange={(event) => setPassword(event.target.value)}
          required
          value={password}
        />
        <div aria-label="Password strength" className="grid grid-cols-4 gap-1" role="meter" aria-valuemax={4} aria-valuemin={0} aria-valuenow={strength}>
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              className={cn("h-1.5 rounded-full bg-muted", index < strength && "bg-primary")}
              key={index}
            />
          ))}
        </div>
        <PasswordInput
          autoComplete="new-password"
          description="Re-enter the same password."
          error={mismatch ? "Passwords do not match." : undefined}
          label="Confirm password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          value={confirmPassword}
        />
        <Button
          disabled={!password || mismatch || strength < 2 || !flow?.verificationToken}
          fullWidth
          loading={resetPassword.isPending}
          type="submit"
        >
          Reset password
        </Button>
        <Button fullWidth render={<Link href="/login" />} variant="outline">
          Back to sign in
        </Button>
      </form>
    </AuthShell>
  );
}
