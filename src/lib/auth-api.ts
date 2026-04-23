import type {
  AuthResponse,
  RefreshTokenRequest,
  SessionRead,
  UserCreate,
  UserLogin,
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

function getApiBaseUrl() {
  const baseUrl =
    import.meta.env.VITE_PUBLIC_API_URL ?? import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing VITE_PUBLIC_API_URL environment variable");
  }

  return baseUrl;
}

function buildUrl(path: string) {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL
    : `${API_BASE_URL}/`;

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

  const response = await fetch(buildUrl(path), {
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

export function login(data: UserLogin) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: UserCreate) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function refresh(data: RefreshTokenRequest) {
  return request<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(data: RefreshTokenRequest) {
  return request<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function session(accessToken: string) {
  return request<SessionRead>("/auth/session", {
    method: "GET",
  }, accessToken);
}
