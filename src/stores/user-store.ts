import type {
  AuthResponse,
  PasswordChange,
  User,
  UserCreate,
  UserLogin,
  UserProfileUpdate,
} from "@/lib/auth-types.ts";
import {
  AuthApiError,
  changePassword as apiChangePassword,
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
  register as apiRegister,
  session as apiSession,
  updateMyProfile,
} from "@/lib/auth-api.ts";
import { create } from "zustand/react";

interface UserStore {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  applyAuthResponse: (response: AuthResponse) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  clearUser: () => void;
  login: (data: UserLogin) => Promise<void>;
  signup: (data: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserProfileUpdate) => Promise<void>;
  changePassword: (data: PasswordChange) => Promise<void>;
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

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function applyAuthResponse(
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
  applyAuthResponse: (response) => applyAuthResponse(set, response),
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
          applyAuthResponse(set, response);
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
      applyAuthResponse(set, response);
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
      applyAuthResponse(set, response);
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
    const refreshToken = getRefreshToken();

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
  updateProfile: async (data) => {
    set({ error: null });

    const accessToken = getAccessToken();
    if (!accessToken) {
      const error = new Error("Missing access token");
      set({ error: error.message });
      throw error;
    }

    try {
      const user = await updateMyProfile(data, accessToken);
      set({ user, error: null });
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        await useUser.getState().checkAuth();
      }

      set({
        error:
          error instanceof Error ? error.message : "Unable to update profile",
      });
      throw error;
    }
  },
  changePassword: async (data) => {
    set({ error: null });

    const accessToken = getAccessToken();
    if (!accessToken) {
      const error = new Error("Missing access token");
      set({ error: error.message });
      throw error;
    }

    try {
      await apiChangePassword(data, accessToken);
      set({ error: null });
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        await useUser.getState().checkAuth();
      }

      set({
        error:
          error instanceof Error ? error.message : "Unable to change password",
      });
      throw error;
    }
  },
}));
