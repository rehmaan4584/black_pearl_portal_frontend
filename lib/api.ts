import { clearStoredToken, getStoredToken } from "@/lib/auth-token";

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const errorData = await res.json();
    if (typeof errorData?.message === "string" && errorData.message) {
      return errorData.message;
    }
    if (Array.isArray(errorData?.message)) {
      return errorData.message.join(", ");
    }
  } catch {
    /* non-JSON body */
  }
  return fallback;
}

export async function apiRequest(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: unknown,
) {
  const token = getStoredToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      clearStoredToken();
      window.location.href = "/login";
    }
    const message = await readErrorMessage(res, "API request failed");
    throw new Error(message);
  }

  return res.json();
}

export async function apiUpload(path: string, formData: FormData) {
  const token = getStoredToken();

  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      clearStoredToken();
      window.location.href = "/login";
    }
    const message = await readErrorMessage(res, "Upload failed");
    throw new Error(message);
  }

  return res.json();
}
