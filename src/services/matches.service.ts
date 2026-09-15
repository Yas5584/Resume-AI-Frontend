import { apiFetch } from "./api-client";
import { MatchAnalysis } from "@resumeai/shared";

export interface MatchListItem {
  id: string;
  resumeId: string;
  jobId: string;
  matchScore: number;
  scoreVersion: string;
  resumeTitle: string;
  jobTitle: string;
  jobCompany: string | null;
  isStale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchesListResponse {
  items: MatchListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MatchDetailResponse {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  matchScore: number;
  scoreVersion: string;
  resumeUpdatedAt?: string | null;
  jobUpdatedAt?: string | null;
  analysis: MatchAnalysis;
  isStale: boolean;
  resume?: {
    id: string;
    title: string;
    updatedAt: string;
  };
  job?: {
    id: string;
    title: string;
    company: string | null;
    updatedAt: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const matchesService = {
  async list(page = 1, limit = 20): Promise<MatchesListResponse> {
    const res = await apiFetch<MatchesListResponse>(
      `/api/matches?page=${page}&limit=${limit}`,
    );
    return res;
  },

  async getById(id: string): Promise<MatchDetailResponse> {
    const res = await apiFetch<MatchDetailResponse>(`/api/matches/${id}`);
    return res;
  },

  async create(resumeId: string, jobId: string): Promise<MatchDetailResponse> {
    const res = await apiFetch<MatchDetailResponse>("/api/matches", {
      method: "POST",
      body: JSON.stringify({ resumeId, jobId }),
    });
    return res;
  },

  async delete(id: string): Promise<{ success: boolean; id: string }> {
    return apiFetch<{ success: boolean; id: string }>(`/api/matches/${id}`, {
      method: "DELETE",
    });
  },
};
