import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";

import type { LoginFormValues } from "@/features/auth/schema";

type LoginResponse = {
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

export async function login(values: LoginFormValues) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  });

  return (await response.json()) as ApiResponse<LoginResponse>;
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST"
  });

  return (await response.json()) as ApiResponse<Record<string, never>>;
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    cache: "no-store"
  });

  return (await response.json()) as ApiResponse<MeResponse>;
}
