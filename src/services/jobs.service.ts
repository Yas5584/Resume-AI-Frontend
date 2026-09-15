import { apiFetch, API_BASE_URL, ApiError } from "./api-client";
import { JobAnalysis } from "@resumeai/shared";

export interface JobDescriptionItem {
  id: string;
  userId: string;
  title: string;
  company: string | null;
  rawText: string;
  normalizedText?: string | null;
  status: "PENDING" | "ANALYZING" | "VALIDATING" | "COMPLETED" | "FAILED";
  parsedData?: JobAnalysis | null;
  errorMessage?: string | null;
  tokensUsed: number;
  processingTimeMs?: number | null;
  url?: string | null;
  resumeId?: string | null;
  resume?: {
    id: string;
    title: string;
    currentTemplateId?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobsListResponse {
  items: JobDescriptionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateJobInput {
  title?: string;
  company?: string;
  rawText: string;
  url?: string;
  resumeId?: string;
  autoAnalyze?: boolean;
}

export const jobsService = {
  async list(page = 1, limit = 20): Promise<JobsListResponse> {
    return apiFetch<JobsListResponse>(`/api/jobs?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<JobDescriptionItem> {
    return apiFetch<JobDescriptionItem>(`/api/jobs/${id}`);
  },

  async create(data: CreateJobInput): Promise<JobDescriptionItem> {
    return apiFetch<JobDescriptionItem>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async upload(
    file: File,
    title?: string,
    company?: string,
    resumeId?: string,
  ): Promise<JobDescriptionItem> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (company) formData.append("company", company);
    if (resumeId) formData.append("resumeId", resumeId);

    const response = await fetch(`${API_BASE_URL}/api/jobs/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorPayload = data.error || {};
      throw new ApiError(
        response.status,
        errorPayload.code || "JOB_UPLOAD_ERROR",
        errorPayload.message || "Failed to upload job description",
        errorPayload.details,
      );
    }
    return (data.data ?? data) as JobDescriptionItem;
  },

  async analyze(id: string): Promise<JobDescriptionItem> {
    return apiFetch<JobDescriptionItem>(`/api/jobs/${id}/analyze`, {
      method: "POST",
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`/api/jobs/${id}`, {
      method: "DELETE",
    });
  },
};
