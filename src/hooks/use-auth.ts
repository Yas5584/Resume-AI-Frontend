"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "../services/api-client";
import { AuthUser, LoginRequest, RegisterRequest } from "@resumeai/shared";
import { useRouter } from "next/navigation";

function clearLegacyClientAuthState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("resumeai_token");
    sessionStorage.removeItem("resumeai_token");
    document.cookie =
      "resumeai_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;";
  } catch {
    // ignore storage access errors
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AuthUser | null, ApiError>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await apiFetch<AuthUser>("/api/auth/me", {
          cache: "no-store",
        });
        return response;
      } catch (err: any) {
        if (err.statusCode === 401 || err.statusCode === 403) {
          clearLegacyClientAuthState();
          return null;
        }
        throw err;
      }
    },
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) return false;
      return failureCount < 2;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
      clearLegacyClientAuthState();

      const res = await apiFetch<{ user: AuthUser; token?: string }>(
        "/api/auth/login",
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify(credentials),
        },
      );

      // Populate React Query cache synchronously before resolving so AppShell immediately sees the authenticated user
      queryClient.setQueryData(["auth", "me"], res.user);

      return res;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
      clearLegacyClientAuthState();

      const res = await apiFetch<{ user: AuthUser; token?: string }>(
        "/api/auth/register",
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify(data),
        },
      );

      // Populate React Query cache synchronously before resolving so AppShell immediately sees the authenticated user
      queryClient.setQueryData(["auth", "me"], res.user);

      return res;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries();
      clearLegacyClientAuthState();
      try {
        await apiFetch("/api/auth/logout", {
          method: "POST",
          cache: "no-store",
        });
      } catch {
        // Continue clearing client state even if network request fails
      }
    },
    onSettled: () => {
      clearLegacyClientAuthState();
      // Clear all cached queries FIRST, then set ["auth", "me"] to null so it remains cached as unauthenticated
      queryClient.clear();
      queryClient.setQueryData(["auth", "me"], null);
      router.replace("/login");
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isError,
    error,
    isAuthenticated: !!user,
    refetch,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
