"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Smartphone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { appToast } from "@/components/ui/sonner";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/services/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { publicSiteConfig } from "@/constants/public-site";

function isEmailOrMobile(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[6-9]\d{9}$/.test(value);
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => authService.login({ identifier: identifier.trim(), password }),
    onSuccess: (data) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      appToast.success("Signed in successfully");
      const next = searchParams.get("next");
      if (next?.startsWith("/account")) {
        router.push(next);
        return;
      }
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
        return;
      }
      router.push("/account");
    },
    onError: (error) => appToast.error("Sign in failed", getApiErrorMessage(error)),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmailOrMobile(identifier) || password.length < 8 || login.isPending) return;
    login.mutate();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-5" />
        </div>
        <h1 className="text-3xl font-bold">Sign in to {publicSiteConfig.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Access your favorites, reviews, and account settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            <Input
              label="Email or mobile"
              leftIcon={<Smartphone />}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              value={identifier}
            />
            <PasswordInput label="Password" onChange={(event) => setPassword(event.target.value)} required value={password} />
            <Checkbox label="Remember this device" />
            <Button fullWidth loading={login.isPending} type="submit">
              Sign In
            </Button>
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <Link className="text-primary hover:underline" href="/forgot-password">
                Forgot password?
              </Link>
              <Link className="text-muted-foreground hover:text-primary" href="/login">
                Admin login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">Loading sign in...</div>}>
      <SignInForm />
    </Suspense>
  );
}
