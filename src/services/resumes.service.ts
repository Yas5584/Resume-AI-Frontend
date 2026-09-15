import { apiFetch, downloadFile, API_BASE_URL, ApiError } from "./api-client";
import {
  ResumeData,
  TemplateConfig,
  CreateResumeRequest,
  UpdateResumeRequest,
  UpdateResumeDesignRequest,
} from "@resumeai/shared";

export interface ResumeSummary {
  id: string;
  userId: string;
  title: string;
  targetRole?: string | null;
  currentTemplateId: string;
  templateConfig?: TemplateConfig | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeDetail extends ResumeSummary {
  resumeData: ResumeData;
  versions?: ResumeVersionSummary[];
}

export interface ResumeVersionSummary {
  id: string;
  resumeId: string;
  versionNumber: number;
  title: string;
  templateConfig?: TemplateConfig | null;
  changeSummary?: string | null;
  createdAt: string;
}

export interface ResumeVersionDetail extends ResumeVersionSummary {
  resumeData: ResumeData;
}

export interface ResumesListResponse {
  items: ResumeSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const resumesService = {
  async list(page = 1, limit = 20): Promise<ResumesListResponse> {
    return apiFetch<ResumesListResponse>(
      `/api/resumes?page=${page}&limit=${limit}`,
    );
  },

  async getById(id: string): Promise<ResumeDetail> {
    return apiFetch<ResumeDetail>(`/api/resumes/${id}`);
  },

  async create(data: CreateResumeRequest): Promise<ResumeDetail> {
    return apiFetch<ResumeDetail>("/api/resumes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateResumeRequest): Promise<ResumeDetail> {
    return apiFetch<ResumeDetail>(`/api/resumes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async updateDesign(
    id: string,
    data: UpdateResumeDesignRequest,
  ): Promise<ResumeDetail> {
    return apiFetch<ResumeDetail>(`/api/resumes/${id}/design`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async duplicate(id: string, title?: string): Promise<ResumeDetail> {
    return apiFetch<ResumeDetail>(`/api/resumes/${id}/duplicate`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`/api/resumes/${id}`, {
      method: "DELETE",
    });
  },

  async listVersions(id: string): Promise<ResumeVersionSummary[]> {
    return apiFetch<ResumeVersionSummary[]>(`/api/resumes/${id}/versions`);
  },

  async createVersion(
    id: string,
    changeSummary?: string,
  ): Promise<ResumeVersionDetail> {
    return apiFetch<ResumeVersionDetail>(`/api/resumes/${id}/versions`, {
      method: "POST",
      body: JSON.stringify({ changeSummary }),
    });
  },

  async getVersion(
    id: string,
    versionNumber: number,
  ): Promise<ResumeVersionDetail> {
    return apiFetch<ResumeVersionDetail>(
      `/api/resumes/${id}/versions/${versionNumber}`,
    );
  },

  async exportPdf(id: string, fallbackFilename = "resume.pdf"): Promise<void> {
    return downloadFile(`/api/resumes/${id}/export/pdf`, fallbackFilename);
  },

  async exportDocx(
    id: string,
    fallbackFilename = "resume.docx",
  ): Promise<void> {
    return downloadFile(`/api/resumes/${id}/export/docx`, fallbackFilename);
  },

  async importResume(file: File, title: string, targetRole?: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (targetRole) formData.append("targetRole", targetRole);

    const url = `${API_BASE_URL}/api/imports`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
      // Do NOT set Content-Type header — browser sets multipart boundary automatically
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorPayload = data.error || {};
      throw new ApiError(
        response.status,
        errorPayload.code || "IMPORT_ERROR",
        errorPayload.message || "Failed to import resume",
        errorPayload.details,
      );
    }

    return (data.data ?? data) as any;
  },

  async getImport(id: string) {
    return apiFetch<any>(`/api/imports/${id}`);
  },

  async listImports() {
    return apiFetch<any>("/api/imports");
  },
};
