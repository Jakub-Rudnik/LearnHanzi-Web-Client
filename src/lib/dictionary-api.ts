import { apiRequest, getServiceBaseUrl } from "@/lib/api-client.ts";

const DICTIONARY_API_BASE_URL = getServiceBaseUrl(
  "VITE_PUBLIC_DICTIONARY_URL",
  import.meta.env.VITE_PUBLIC_DICTIONARY_URL
);

export type Hanzi = {
  id: string;
  character: string;
  pinyin: string;
  meaning_pl: string;
  meaning_en: string;
  difficulty_level: number;
  theme_category: string | null;
};

export function listHanzi({
  limit = 100,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}) {
  return apiRequest<Hanzi[]>(DICTIONARY_API_BASE_URL, "/hanzi/", {
    method: "GET",
    params: { limit, offset },
  });
}

export function getHanziByCharacter(character: string) {
  return apiRequest<Hanzi>(
    DICTIONARY_API_BASE_URL,
    `/hanzi/character/${encodeURIComponent(character)}`,
    { method: "GET" }
  );
}

export function getHanziById(hanziId: string) {
  return apiRequest<Hanzi>(
    DICTIONARY_API_BASE_URL,
    `/hanzi/${encodeURIComponent(hanziId)}`,
    { method: "GET" }
  );
}
