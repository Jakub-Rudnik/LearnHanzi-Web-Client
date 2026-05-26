import { getServiceBaseUrl } from "@/lib/api-client.ts";
import { requestWithAuth, type AuthSession } from "@/lib/auth-api.ts";
import {
  getAccessToken,
  getRefreshToken,
  useUser,
} from "@/stores/user-store.ts";

const FLASHCARD_API_BASE_URL = getServiceBaseUrl(
  "VITE_PUBLIC_FLASHCARD_URL",
  import.meta.env.VITE_PUBLIC_FLASHCARD_URL
);

function authSession(): AuthSession {
  return {
    getAccessToken,
    getRefreshToken,
    applyAuthResponse: useUser.getState().applyAuthResponse,
    clearAuth: useUser.getState().clearUser,
  };
}

export type FlashcardHanzi = {
  id: string;
  character: string;
  pinyin: string;
  meaning_pl: string;
  meaning_en: string;
  difficulty_level: number;
  theme_category: string | null;
};

export type FlashcardItem = {
  id: string;
  hanzi_id: string;
  position: number;
};

export type FlashcardSetSummary = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cards_count: number;
  created_at: string;
  updated_at: string;
};

export type FlashcardSet = FlashcardSetSummary & {
  cards: FlashcardItem[];
};

export type FlashcardSetCreate = {
  name: string;
  description?: string | null;
  hanzi_ids: string[];
};

export type FlashcardSetUpdate = {
  name?: string;
  description?: string | null;
  hanzi_ids?: string[];
};

export type StudyCard = {
  card_id: string;
  set_id: string;
  position: number;
  hanzi: FlashcardHanzi;
  is_favorite: boolean;
  is_difficult: boolean;
};

export type StudySet = {
  set_id: string;
  set_name: string;
  description: string | null;
  cards: StudyCard[];
};

export type FlashcardState = {
  id: string;
  user_id: string;
  hanzi_id: string;
  is_favorite: boolean;
  is_difficult: boolean;
  updated_at: string;
};

export type MarkedHanzi = {
  state: FlashcardState | null;
  hanzi: FlashcardHanzi;
};

export function listFlashcardSets() {
  return requestWithAuth<FlashcardSetSummary[]>(
    FLASHCARD_API_BASE_URL,
    "/flashcards/sets",
    authSession(),
    { method: "GET" }
  );
}

export function createFlashcardSet(payload: FlashcardSetCreate) {
  return requestWithAuth<FlashcardSet>(
    FLASHCARD_API_BASE_URL,
    "/flashcards/sets",
    authSession(),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function getFlashcardSet(setId: string) {
  return requestWithAuth<FlashcardSet>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/sets/${encodeURIComponent(setId)}`,
    authSession(),
    { method: "GET" }
  );
}

export function updateFlashcardSet(setId: string, payload: FlashcardSetUpdate) {
  return requestWithAuth<FlashcardSet>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/sets/${encodeURIComponent(setId)}`,
    authSession(),
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function deleteFlashcardSet(setId: string) {
  return requestWithAuth<void>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/sets/${encodeURIComponent(setId)}`,
    authSession(),
    { method: "DELETE" }
  );
}

export function addCardToFlashcardSet(setId: string, hanziId: string) {
  return requestWithAuth<FlashcardSet>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/sets/${encodeURIComponent(setId)}/cards/${encodeURIComponent(
      hanziId
    )}`,
    authSession(),
    { method: "POST" }
  );
}

export function removeCardFromFlashcardSet(setId: string, hanziId: string) {
  return requestWithAuth<FlashcardSet>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/sets/${encodeURIComponent(setId)}/cards/${encodeURIComponent(
      hanziId
    )}`,
    authSession(),
    { method: "DELETE" }
  );
}

export function getStudySet(setId: string) {
  return requestWithAuth<StudySet>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/sets/${encodeURIComponent(setId)}/study`,
    authSession(),
    { method: "GET" }
  );
}

export function listFavoriteHanzi() {
  return requestWithAuth<MarkedHanzi[]>(
    FLASHCARD_API_BASE_URL,
    "/flashcards/favorites",
    authSession(),
    { method: "GET" }
  );
}

export function addFavoriteHanzi(hanziId: string) {
  return requestWithAuth<MarkedHanzi>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/favorites/${encodeURIComponent(hanziId)}`,
    authSession(),
    { method: "POST" }
  );
}

export function removeFavoriteHanzi(hanziId: string) {
  return requestWithAuth<MarkedHanzi>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/favorites/${encodeURIComponent(hanziId)}`,
    authSession(),
    { method: "DELETE" }
  );
}

export function listDifficultHanzi() {
  return requestWithAuth<MarkedHanzi[]>(
    FLASHCARD_API_BASE_URL,
    "/flashcards/difficult",
    authSession(),
    { method: "GET" }
  );
}

export function addDifficultHanzi(hanziId: string) {
  return requestWithAuth<MarkedHanzi>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/difficult/${encodeURIComponent(hanziId)}`,
    authSession(),
    { method: "POST" }
  );
}

export function removeDifficultHanzi(hanziId: string) {
  return requestWithAuth<MarkedHanzi>(
    FLASHCARD_API_BASE_URL,
    `/flashcards/difficult/${encodeURIComponent(hanziId)}`,
    authSession(),
    { method: "DELETE" }
  );
}
