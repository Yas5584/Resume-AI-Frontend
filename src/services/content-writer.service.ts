import { apiFetch } from "./api-client";
import {
  ContentProposalStatus,
  ContentProposalSummaryStats,
  ResumeContentChange,
  RegenerateSectionInput,
  SectionRegenerationResponse,
} from "@resumeai/shared";

export interface ProposalDetailResponse {
  id: string;
  proposalId: string;
  userId: string;
  resumeId: string;
  jobId: string;
  matchId?: string | null;
  strategyId?: string | null;
  appliedVersionId?: string | null;
  status: ContentProposalStatus;
  isStale: boolean;
  resumeTitle?: string;
  jobTitle?: string;
  jobCompany?: string | null;
  changes: ResumeContentChange[];
  summaryStats: ContentProposalSummaryStats;
  generalNotes?: string;
  resumeUpdatedAt?: string | null;
  jobUpdatedAt?: string | null;
  matchUpdatedAt?: string | null;
  strategyUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  appliedVersion?: {
    id: string;
    versionNumber: number;
    title: string;
    createdAt: string;
  } | null;
}

export const contentWriterService = {
  async generate(data: {
    resumeId: string;
    jobId: string;
    matchId?: string;
    strategyId?: string;
  }): Promise<ProposalDetailResponse> {
    return apiFetch<ProposalDetailResponse>("/api/content-writer/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getProposal(id: string): Promise<ProposalDetailResponse> {
    return apiFetch<ProposalDetailResponse>(
      `/api/content-writer/proposals/${id}`,
    );
  },

  async updateChangeStatus(
    proposalId: string,
    changeId: string,
    status: "APPROVED" | "REJECTED",
  ): Promise<{
    success: boolean;
    changeId: string;
    status: string;
    proposalStats: ContentProposalSummaryStats;
  }> {
    return apiFetch(
      `/api/content-writer/proposals/${proposalId}/changes/${changeId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
  },

  async apply(
    proposalId: string,
    selectedChangeIds?: string[],
  ): Promise<{
    success: boolean;
    resumeId: string;
    versionId: string;
    versionNumber: number;
    appliedChangesCount: number;
  }> {
    return apiFetch(`/api/content-writer/proposals/${proposalId}/apply`, {
      method: "POST",
      body: JSON.stringify({ selectedChangeIds }),
    });
  },

  async reject(
    proposalId: string,
  ): Promise<{ success: boolean; status: string }> {
    return apiFetch(`/api/content-writer/proposals/${proposalId}/reject`, {
      method: "POST",
    });
  },

  async revalidate(proposalId: string): Promise<ProposalDetailResponse> {
    return apiFetch<ProposalDetailResponse>(
      `/api/content-writer/proposals/${proposalId}/revalidate`,
      { method: "POST" },
    );
  },

  async delete(proposalId: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/content-writer/proposals/${proposalId}`, {
      method: "DELETE",
    });
  },

  async regenerateSection(
    data: RegenerateSectionInput,
  ): Promise<SectionRegenerationResponse> {
    return apiFetch<SectionRegenerationResponse>(
      "/api/content-writer/regenerate-section",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },
};
