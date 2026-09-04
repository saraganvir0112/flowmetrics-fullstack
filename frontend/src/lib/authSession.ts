import { SafeUser } from '@/types/auth';

const TOKEN_KEY = 'flowmetrics_admin_token';
const USER_KEY = 'flowmetrics_admin_user';

/**
 * Retrieves the raw sanitized JWT token from sessionStorage.
 * Automatically strips any accidental 'Bearer ' prefix and trims whitespace.
 * Returns null if running in SSR, or if token is missing/empty.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;

    let cleanToken = raw.trim();
    if (cleanToken.toLowerCase().startsWith('bearer ')) {
      cleanToken = cleanToken.slice(7).trim();
    }

    if (!cleanToken || cleanToken === 'null' || cleanToken === 'undefined') {
      return null;
    }

    return cleanToken;
  } catch {
    return null;
  }
}

/**
 * Stores the authenticated JWT token and minimal user profile into sessionStorage.
 * Never stores passwords or sensitive data. Does not persist to localStorage.
 */
export function setAuthSession(token: string, user: SafeUser): void {
  if (typeof window === 'undefined') return;

  try {
    let cleanToken = token.trim();
    if (cleanToken.toLowerCase().startsWith('bearer ')) {
      cleanToken = cleanToken.slice(7).trim();
    }

    window.sessionStorage.setItem(TOKEN_KEY, cleanToken);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save session to sessionStorage:', err);
  }
}

/**
 * Clears the active authentication session from sessionStorage.
 * Also removes any legacy tokens to prevent stale credentials.
 */
export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    // Remove any legacy keys that might have been stored previously
    window.localStorage.removeItem('adminToken');
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

/**
 * Returns the currently signed-in user profile from sessionStorage, or null if unauthenticated.
 */
export function getAuthUser(): SafeUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SafeUser;
  } catch {
    return null;
  }
}

/**
 * Returns true if a valid JWT token exists in the current browser session.
 */
export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}
