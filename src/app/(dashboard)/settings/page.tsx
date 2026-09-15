"use client";

import * as React from "react";
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
import { Badge } from "../../../components/ui/badge";
import { useAuth } from "../../../hooks/use-auth";
import { apiFetch, ApiError } from "../../../services/api-client";
import { UserProfileResponse } from "@resumeai/shared";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, refetch, isLoading } = useAuth();

  const [name, setName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Full name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await apiFetch<UserProfileResponse>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      });

      await refetch();
      setSuccessMessage("Profile updated successfully.");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message || "Failed to update profile.");
      } else {
        setErrorMessage("An unexpected network error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, preferences, and subscription tier.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile Information</CardTitle>
            <CardDescription>
              Your name and email address for system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              disabled={isLoading || isSaving}
            />
            <Input
              label="Email Address"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email addresses cannot be changed directly in Phase 1.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              isLoading={isSaving}
              disabled={isLoading || isSaving}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base">
              Subscription & AI Credits
            </CardTitle>
            <CardDescription className="mt-1">
              Your current tier and credit balances.
            </CardDescription>
          </div>
          <Badge variant="default">
            {user?.subscriptionTier || "FREE"} Tier (
            {user?.creditsBalance ?? 10} Credits)
          </Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            You are currently on the{" "}
            <strong>{user?.subscriptionTier || "FREE"}</strong> plan with{" "}
            <strong>{user?.creditsBalance ?? 10}</strong> monthly credits.
          </p>
          <p className="text-xs">
            Billing management and credit add-ons via Lemon Squeezy and Whop are
            planned for future phases.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
