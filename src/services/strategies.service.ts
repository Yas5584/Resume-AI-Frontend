import { apiFetch } from "./api-client";
import { ResumeStrategy, StrategyApprovalStatus } from "@resumeai/shared";

export interface StrategyListItem {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  matchId: string | null;
  strategyVersion: string;
  status: StrategyApprovalStatus;
  isStale: boolean;
  resume?: {
    id: string;
    title: string;
    updatedAt: string;
    currentTemplateId?: string;
  };
  job?: {
    id: string;
    title: string;
    company: string | null;
    updatedAt: string;
    status: string;
  };
  match?: {
    id: string;
    matchScore: number;
    updatedAt: string;
  };
  strategyData: ResumeStrategy;
  createdAt: string;
  updatedAt: string;
}

export interface StrategiesListResponse {
  items: StrategyListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const strategiesService = {
  async list(page = 1, limit = 20): Promise<StrategiesListResponse> {
    return apiFetch<StrategiesListResponse>(
      `/api/strategies?page=${page}&limit=${limit}`,
    );
  },

  async getById(id: string): Promise<StrategyListItem> {
    return apiFetch<StrategyListItem>(`/api/strategies/${id}`);
  },

  async create(
    resumeId: string,
    jobId: string,
    matchId?: string,
  ): Promise<StrategyListItem> {
    return apiFetch<StrategyListItem>("/api/strategies", {
      method: "POST",
      body: JSON.stringify({ resumeId, jobId, matchId }),
    });
  },

  async updateStatus(
    id: string,
    status: StrategyApprovalStatus,
  ): Promise<StrategyListItem> {
    return apiFetch<StrategyListItem>(`/api/strategies/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async regenerate(id: string): Promise<StrategyListItem> {
    return apiFetch<StrategyListItem>(`/api/strategies/${id}/regenerate`, {
      method: "POST",
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/api/strategies/${id}`, {
      method: "DELETE",
    });
  },
};
