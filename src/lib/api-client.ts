export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
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

function normalizeBaseUrl(baseUrl: string | undefined, envName: string) {
  if (!baseUrl) {
    throw new Error(`Missing ${envName} environment variable`);
  }

  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | undefined>
) {
  const url = new URL(path.replace(/^\//, ""), baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
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

export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  init: RequestInit & {
    params?: Record<string, string | number | undefined>;
  } = {}
) {
  const { params, ...requestInit } = init;
  const headers = new Headers(requestInit.headers);

  if (!headers.has("Content-Type") && requestInit.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(baseUrl, path, params), {
    ...requestInit,
    headers,
  });

  const payload = await readResponsePayload<unknown>(response).catch(
    () => undefined
  );

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(payload, response.status),
      payload
    );
  }

  return payload as T;
}

export function getServiceBaseUrl(envName: string, value: string | undefined) {
  return normalizeBaseUrl(value, envName);
}
