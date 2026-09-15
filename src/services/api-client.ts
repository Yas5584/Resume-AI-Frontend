export const API_BASE_URL =
  typeof window !== "undefined"
    ? ""
    : process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4000";

export interface ApiFetchOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers = {}, ...customConfig } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    credentials: "include", // Transmit HttpOnly session cookies across origins
    ...customConfig,
    headers: requestHeaders,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorPayload = data.error || {};
    const err = new ApiError(
      response.status,
      errorPayload.code || "UNKNOWN_ERROR",
      errorPayload.message ||
        response.statusText ||
        "An unexpected error occurred",
      errorPayload.details,
    );

    throw err;
  }

  return (data.data ?? data) as T;
}

export async function downloadFile(
  endpoint: string,
  fallbackFilename: string,
): Promise<void> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    let errorMsg = `Export failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data.error?.message) {
        errorMsg = data.error.message;
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, "EXPORT_ERROR", errorMsg);
  }

  let filename = fallbackFilename;
  const disposition = response.headers.get("Content-Disposition");
  if (disposition && disposition.includes("filename=")) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, "");
    }
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
