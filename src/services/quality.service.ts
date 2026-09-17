import { apiFetch } from "./api-client";
import {
  ResumeQualityReport,
  AnalyzeResumeQualityInput,
} from "@resumeai/shared";

export const qualityService = {
  async analyze(
    resumeId: string,
    input?: AnalyzeResumeQualityInput,
  ): Promise<ResumeQualityReport> {
    return apiFetch<ResumeQualityReport>(
      `/api/resumes/${resumeId}/quality/analyze`,
      {
        method: "POST",
        body: JSON.stringify(input || {}),
      },
    );
  },

  async getLatest(
    resumeId: string,
    jobId?: string,
  ): Promise<ResumeQualityReport | null> {
    const query = jobId ? `?jobId=${encodeURIComponent(jobId)}` : "";
    return apiFetch<ResumeQualityReport | null>(
      `/api/resumes/${resumeId}/quality${query}`,
    );
  },

  async delete(resumeId: string): Promise<{ deleted: boolean }> {
    return apiFetch<{ deleted: boolean }>(`/api/resumes/${resumeId}/quality`, {
      method: "DELETE",
    });
  },
};
