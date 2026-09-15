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
          if (typeof document !== "undefined") {
            document.cookie =
              "resumeai_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          }
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
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
      return res.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      router.push("/dashboard");
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
      return res.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
    },
    onSettled: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      router.push("/login");
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
