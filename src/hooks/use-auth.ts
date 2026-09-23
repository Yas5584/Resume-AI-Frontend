"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "../services/api-client";
import { AuthUser, LoginRequest, RegisterRequest } from "@resumeai/shared";
import { useRouter } from "next/navigation";

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
        const response = await apiFetch<AuthUser>("/api/auth/me");
        return response;
      } catch (err: any) {
        if (err.statusCode === 401 || err.statusCode === 403) {
          // Ensure server clears any stale HttpOnly session cookie
          await apiFetch("/api/auth/logout", { method: "POST" }).catch(
            () => {},
          );
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

      const res = await apiFetch<{ user: AuthUser; token?: string }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credentials),
        },
      );

      // Update React Query cache synchronously before resolving so AppShell immediately sees the authenticated user
      queryClient.setQueryData(["auth", "me"], res.user);

      return res;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });

      const res = await apiFetch<{ user: AuthUser; token?: string }>(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      // Update React Query cache synchronously before resolving so AppShell immediately sees the authenticated user
      queryClient.setQueryData(["auth", "me"], res.user);

      return res;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
      try {
        await apiFetch("/api/auth/logout", {
          method: "POST",
        });
      } catch {
        // Continue clearing client state even if network request fails
      }
    },
    onSettled: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      router.replace("/login");
      router.refresh();
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
