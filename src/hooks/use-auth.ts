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
          if (typeof window !== "undefined") {
            localStorage.removeItem("resumeai_token");
            document.cookie =
              "resumeai_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;";
          }
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
      const res = await apiFetch<{ user: AuthUser; token?: string }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credentials),
        },
      );

      if (res.token && typeof window !== "undefined") {
        localStorage.setItem("resumeai_token", res.token);
        document.cookie = `resumeai_session=${res.token}; Path=/; Max-Age=604800; SameSite=Lax`;
      }

      return res;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["auth", "me"], res.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await apiFetch<{ user: AuthUser; token?: string }>(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      if (res.token && typeof window !== "undefined") {
        localStorage.setItem("resumeai_token", res.token);
        document.cookie = `resumeai_session=${res.token}; Path=/; Max-Age=604800; SameSite=Lax`;
      }

      return res;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["auth", "me"], res.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiFetch("/api/auth/logout", {
          method: "POST",
        });
      } catch {
        // Continue clearing local state even if logout request fails
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("resumeai_token");
        document.cookie =
          "resumeai_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;";
      }
    },
    onSettled: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      window.location.href = "/login";
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
