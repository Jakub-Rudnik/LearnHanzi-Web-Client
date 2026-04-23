import type {
  AuthResponse,
  User,
  UserCreate,
  UserLogin,
} from "@/lib/auth-types.ts";
import {
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
  register as apiRegister,
  session as apiSession,
} from "@/lib/auth-api.ts";
import { create } from "zustand/react";

interface UserStore {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  clearUser: () => void;
  login: (data: UserLogin) => Promise<void>;
  signup: (data: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

let authCheckPromise: Promise<void> | null = null;

function persistTokens(tokens: AuthResponse["tokens"]) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

function clearPersistedTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function setAuthResponse(
  set: (partial: Partial<UserStore>) => void,
  response: AuthResponse
) {
  persistTokens(response.tokens);
  set({ user: response.user, error: null });
}

function clearStoredUser(set: (partial: Partial<UserStore>) => void) {
  clearPersistedTokens();
  set({ user: null, error: null });
}

export const useUser = create<UserStore>((set) => ({
  user: null,
  error: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  clearError: () =>
    set((state) => {
      if (state.error === null) {
        return state;
      }

      return { error: null };
    }),
  clearUser: () => clearStoredUser(set),
  checkAuth: async () => {
    if (authCheckPromise) {
      return authCheckPromise;
    }

    authCheckPromise = (async () => {
      set((state) => (state.isLoading ? state : { isLoading: true }));

      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!accessToken && !refreshToken) {
        clearStoredUser(set);
        return;
      }

      if (accessToken) {
        try {
          const session = await apiSession(accessToken);
          set({ user: session.user, error: null });
          return;
        } catch {
          // Try the refresh token next.
        }
      }

      if (refreshToken) {
        try {
          const response = await apiRefresh({ refresh_token: refreshToken });
          setAuthResponse(set, response);
          return;
        } catch {
          clearStoredUser(set);
          return;
        }
      }

      clearStoredUser(set);
    })();

    try {
      await authCheckPromise;
    } finally {
      authCheckPromise = null;
      set((state) => (state.isLoading ? { isLoading: false } : state));
    }
  },
  login: async (data) => {
    set({ error: null });

    try {
      const response = await apiLogin(data);
      setAuthResponse(set, response);
    } catch (error) {
      clearPersistedTokens();
      set({
        user: null,
        error: error instanceof Error ? error.message : "Unable to log in",
      });
      throw error;
    }
  },
  signup: async (data) => {
    set({ error: null });

    try {
      const response = await apiRegister(data);
      setAuthResponse(set, response);
    } catch (error) {
      clearPersistedTokens();
      set({
        user: null,
        error: error instanceof Error ? error.message : "Unable to sign up",
      });
      throw error;
    }
  },
  logout: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      if (refreshToken) {
        await apiLogout({ refresh_token: refreshToken });
      }
    } catch {
      // The session is being cleared locally regardless of logout API errors.
    } finally {
      clearStoredUser(set);
    }
  },
}));
