"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Sparkles, Eye, EyeOff, AlertCircle } from "lucide-react";
import { apiFetch, ApiError } from "../../../services/api-client";
import { AuthUser } from "@resumeai/shared";
import { getSafeRedirect } from "../../../lib/redirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      await apiFetch<{ user: AuthUser; token?: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Successful login sets HttpOnly session cookie automatically
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(err.message || "An error occurred during sign in.");
        }
      } else {
        setErrorMessage(
          "Unable to reach the server. Please check your connection.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Sign in to your account</CardTitle>
        <CardDescription>
          Enter your email and password below to continue
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-[32px] text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one now
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="mb-6 flex items-center space-x-2 font-bold text-2xl text-foreground">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <span>ResumeAI</span>
      </div>

      <React.Suspense
        fallback={
          <Card className="w-full max-w-md shadow-md p-6 text-center text-sm text-muted-foreground">
            Loading...
          </Card>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
