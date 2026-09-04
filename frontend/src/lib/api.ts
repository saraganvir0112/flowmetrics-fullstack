import { ApiResponse } from '@/types/api';
import { getAuthToken, clearAuthSession } from './authSession';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://flowmetrics-fullstack.onrender.com/api'
    : process.env.NODE_ENV === 'production'
    ? 'https://flowmetrics-fullstack.onrender.com/api'
    : 'http://localhost:5000/api');

export class ApiError extends Error {
  public code?: string;
  public details?: unknown;
  public statusCode?: number;

  constructor(message: string, statusCode?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Shared public API client for making unauthenticated requests.
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {};

  if (options?.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      message: 'Invalid JSON response from server',
      code: 'PARSE_ERROR',
    },
  }));

  if (!response.ok || !json.success) {
    const errorMsg = (!json.success && json.error?.message) || `Request failed with status ${response.status}`;
    const errorCode = (!json.success && json.error?.code) || 'API_ERROR';
    const errorDetails = !json.success ? json.error?.details : undefined;
    throw new ApiError(errorMsg, response.status, errorCode, errorDetails);
  }

  return json.data;
}

/**
 * Shared authenticated API client for protected admin requests.
 * Guarantees that every request sends exactly:
 *   Authorization: Bearer <JWT>
 * Automatically handles 401 (clears session & redirects to /admin).
 * Preserves 403 (throws authorization error without redirecting).
 */
export async function authApiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    clearAuthSession();
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/admin';
    }
    throw new ApiError('Authentication token required. Please log in.', 401, 'UNAUTHORIZED');
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (options?.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
      // Enforce the canonical authorization header format
      Authorization: `Bearer ${token}`,
    },
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      message: 'Invalid JSON response from server',
      code: 'PARSE_ERROR',
    },
  }));

  if (!response.ok || !json.success) {
    const errorMsg = (!json.success && json.error?.message) || `Request failed with status ${response.status}`;
    const errorCode = (!json.success && json.error?.code) || 'API_ERROR';
    const errorDetails = !json.success ? json.error?.details : undefined;

    // Handle 401: Token expired, invalid, or missing
    if (response.status === 401) {
      clearAuthSession();
      if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/admin';
      }
    }

    // Note: 403 Forbidden is NOT redirected; caller displays authorization error.
    throw new ApiError(errorMsg, response.status, errorCode, errorDetails);
  }

  return json.data;
}
