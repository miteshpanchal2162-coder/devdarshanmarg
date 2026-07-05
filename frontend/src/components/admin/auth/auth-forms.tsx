"use client";

import Link from "next/link";
import { CheckCircle2, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { useRef, useState, type ClipboardEvent, type FormEvent, type ReactNode } from "react";

import { PageShell } from "@/components/admin/layout/page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/constants/site";

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

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const identifierError = submitted && !isEmailOrMobile(identifier) ? "Enter a valid email or mobile number." : "";
  const passwordError = submitted && password.length < 8 ? "Password must be at least 8 characters." : "";
  const valid = isEmailOrMobile(identifier) && password.length >= 8;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!valid) return;
    setLoading(true);
    window.setTimeout(() => setLoading(false), 700);
  }

  return (
    <AuthShell
      description="Sign in to continue to the DevDarshanMarg admin console."
      eyebrow="Secure access"
      title="Sign in"
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <Alert
          description="Authentication will be connected in a later step."
          title="UI flow placeholder"
          variant={valid && submitted ? "success" : "info"}
        />
        <Input
          autoComplete="username"
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
          error={passwordError}
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          required
          value={password}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Checkbox
            checked={remember}
            label="Remember me"
            onCheckedChange={(checked) => setRemember(Boolean(checked))}
          />
          <Link className="text-sm font-medium text-primary hover:underline" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <Button fullWidth loading={loading} type="submit">
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const error = submitted && !isEmailOrMobile(identifier) ? "Enter a valid email or mobile number." : "";

  return (
    <AuthShell
      description="Request a one-time password to reset your account password."
      eyebrow="Password recovery"
      title="Forgot password"
    >
      <form className="space-y-4" noValidate onSubmit={(event) => event.preventDefault()}>
        <Input
          error={error}
          label="Email or mobile"
          leftIcon={<Smartphone />}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="admin@example.com or 9876543210"
          required
          success={submitted && !error ? "OTP placeholder is ready for the next screen." : undefined}
          value={identifier}
        />
        <Button fullWidth onClick={() => setSubmitted(true)} type="button">
          Send OTP placeholder
        </Button>
        <Button fullWidth render={<Link href="/otp-verification" />} variant="outline">
          Continue to OTP
        </Button>
      </form>
    </AuthShell>
  );
}

export function OtpVerificationForm() {
  const [otp, setOtp] = useState(Array<string>(6).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const complete = otp.every(Boolean);

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

  return (
    <AuthShell
      description="Enter the 6 digit OTP sent to your email or mobile."
      eyebrow="OTP verification"
      title="Verify OTP"
    >
      <form className="space-y-5" noValidate onSubmit={(event) => event.preventDefault()}>
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
        <p className="text-center text-sm text-muted-foreground">
          Resend OTP placeholder available in 00:30
        </p>
        <Button fullWidth disabled={!complete} render={<Link href="/reset-password" />}>
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const strength = passwordStrength(password);
  const mismatch = confirmPassword && password !== confirmPassword;

  return (
    <AuthShell
      description="Create a new password for your admin account."
      eyebrow="Reset credentials"
      title="Reset password"
    >
      <form className="space-y-4" noValidate onSubmit={(event) => event.preventDefault()}>
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
        <Alert
          description="Password reset submission is a UI placeholder only."
          icon={<CheckCircle2 />}
          title="Ready for integration"
          variant="success"
        />
        <Button fullWidth disabled={!password || mismatch || strength < 2} type="button">
          Reset password placeholder
        </Button>
        <Button fullWidth render={<Link href="/login" />} variant="outline">
          Back to sign in
        </Button>
      </form>
    </AuthShell>
  );
}
