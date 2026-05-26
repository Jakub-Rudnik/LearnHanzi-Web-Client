import type {
  AuthResponse,
  PasswordChange,
  PasswordResetConfirm,
  PasswordResetRequest,
  PasswordResetRequestResponse,
  PublicUser,
  RefreshTokenRequest,
  SessionRead,
  User,
  UserCreate,
  UserIdentity,
  UserLogin,
  UserProfileUpdate,
} from "@/lib/auth-types.ts";

const API_BASE_URL = getApiBaseUrl();

export class AuthApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.payload = payload;
  }
}

export type AuthSession = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  applyAuthResponse: (response: AuthResponse) => void;
  clearAuth: () => void;
};

function getApiBaseUrl() {
  const baseUrl =
    import.meta.env.VITE_PUBLIC_API_URL ?? import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing VITE_PUBLIC_API_URL environment variable");
  }

  return baseUrl;
}

function buildUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return new URL(path.replace(/^\//, ""), normalizedBase).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractErrorMessage(payload: unknown, status: number) {
  if (isRecord(payload)) {
    const { detail } = payload;

    if (Array.isArray(detail)) {
      const messages = detail
        .map((entry) => {
          if (isRecord(entry) && typeof entry.msg === "string") {
            return entry.msg;
          }

          return null;
        })
        .filter((message): message is string => message !== null);

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }

    if (typeof detail === "string") {
      return detail;
    }

    if (typeof payload.message === "string") {
      return payload.message;
    }

    if (typeof payload.error === "string") {
      return payload.error;
    }
  }

  return `Request failed with status ${status}`;
}

async function readResponsePayload<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return undefined as T;
}

async function request<T>(
  baseUrl: string,
  path: string,
  init: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(baseUrl, path), {
    ...init,
    headers,
  });

  const payload = await readResponsePayload<unknown>(response).catch(
    () => undefined
  );

  if (!response.ok) {
    throw new AuthApiError(
      response.status,
      extractErrorMessage(payload, response.status),
      payload
    );
  }

  return payload as T;
}

async function refreshSession(session: AuthSession) {
  const refreshToken = session.getRefreshToken();

  if (!refreshToken) {
    session.clearAuth();
    throw new AuthApiError(401, "Missing refresh token", null);
  }

  try {
    const response = await refresh({ refresh_token: refreshToken });
    session.applyAuthResponse(response);
    return response;
  } catch (error) {
    session.clearAuth();
    throw error;
  }
}

export async function requestWithAuth<T>(
  baseUrl: string,
  path: string,
  session: AuthSession,
  init: RequestInit = {}
): Promise<T> {
  const accessToken = session.getAccessToken();

  if (!accessToken) {
    const response = await refreshSession(session);
    return request<T>(baseUrl, path, init, response.tokens.access_token);
  }

  try {
    return await request<T>(baseUrl, path, init, accessToken);
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) {
      const response = await refreshSession(session);
      return request<T>(baseUrl, path, init, response.tokens.access_token);
    }

    throw error;
  }
}

export function login(data: UserLogin) {
  return request<AuthResponse>(API_BASE_URL, "/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: UserCreate) {
  return request<AuthResponse>(API_BASE_URL, "/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function refresh(data: RefreshTokenRequest) {
  return request<AuthResponse>(API_BASE_URL, "/auth/refresh", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(data: RefreshTokenRequest) {
  return request<void>(API_BASE_URL, "/auth/logout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function session(accessToken: string) {
  return request<SessionRead>(
    API_BASE_URL,
    "/auth/session",
    {
      method: "GET",
    },
    accessToken
  );
}

export function getMyIdentity(session: AuthSession) {
  return requestWithAuth<UserIdentity>(
    API_BASE_URL,
    "/users/me/identity",
    session,
    {
      method: "GET",
    }
  );
}

export function getPublicUser(userId: string) {
  return request<PublicUser>(API_BASE_URL, `/users/${userId}/basic`, {
    method: "GET",
  });
}

export function updateMyProfile(data: UserProfileUpdate, accessToken: string) {
  return request<User>(
    API_BASE_URL,
    "/users/me",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    accessToken
  );
}

export function requestPasswordReset(data: PasswordResetRequest) {
  return request<PasswordResetRequestResponse>(
    API_BASE_URL,
    "/auth/password-reset/request",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function confirmPasswordReset(data: PasswordResetConfirm) {
  return request<void>(API_BASE_URL, "/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function changePassword(data: PasswordChange, accessToken: string) {
  return request<void>(
    API_BASE_URL,
    "/auth/password",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    accessToken
  );
}
