import { ApiError, apiRequest, getServiceBaseUrl } from "@/lib/api-client.ts";

const PROGRESS_API_BASE_URL = getServiceBaseUrl(
  "VITE_PUBLIC_PROGRESS_URL",
  import.meta.env.VITE_PUBLIC_PROGRESS_URL
);

export type ProgressEvent = {
  user_id: string;
  hanzi_id: string;
  is_correct: boolean;
  accuracy_score: number;
  attempt_date?: string | null;
};

export type ProgressResponse = ProgressEvent & {
  id: string;
  points_earned: number;
};

export type RankingItem = {
  user_id: string;
  total_points: number;
};

export function recordProgress(event: ProgressEvent) {
  return apiRequest<ProgressResponse>(PROGRESS_API_BASE_URL, "/progress/", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export async function getLastProgress({
  userId,
  hanziId,
}: {
  userId: string;
  hanziId: string;
}) {
  try {
    return await apiRequest<ProgressResponse>(
      PROGRESS_API_BASE_URL,
      "/progress/last",
      {
        method: "GET",
        params: { user_id: userId, hanzi_id: hanziId },
      }
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export function getRanking(limit = 100) {
  return apiRequest<RankingItem[]>(PROGRESS_API_BASE_URL, "/progress/ranking", {
    method: "GET",
    params: { limit },
  });
}
