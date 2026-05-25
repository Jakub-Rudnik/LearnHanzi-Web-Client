import { apiRequest, getServiceBaseUrl } from "@/lib/api-client.ts";

const RECOGNITION_API_BASE_URL = getServiceBaseUrl(
  "VITE_PUBLIC_RECOGNITION_URL",
  import.meta.env.VITE_PUBLIC_RECOGNITION_URL
);

export type PredictionItem = {
  character: string;
  confidence: number;
};

export type RecognitionResponse = {
  character: string;
  confidence: number;
  top_predictions?: PredictionItem[] | null;
};

export function recognizeHanzi(data: {
  image_base64: string;
  character?: string | null;
}) {
  return apiRequest<RecognitionResponse>(
    RECOGNITION_API_BASE_URL,
    "/recognize",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
