'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, clearAuthSession, isAuthenticated } from '@/lib/authSession';
import { SafeUser } from '@/types/auth';

export interface UseAdminAuthResult {
  isAuthorized: boolean;
  isChecking: boolean;
  user: SafeUser | null;
  logout: () => void;
}

const emptySubscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export function useAdminAuth(): UseAdminAuthResult {
  const router = useRouter();

  // Determine client hydration state without triggering cascading re-renders
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Synchronously subscribe to authentication status from sessionStorage
  const isAuthed = useSyncExternalStore(
    emptySubscribe,
    () => isAuthenticated(),
    () => false
  );

  useEffect(() => {
    if (isHydrated && !isAuthed) {
      router.replace('/admin');
    }
  }, [isHydrated, isAuthed, router]);

  const logout = useCallback(() => {
    clearAuthSession();
    router.replace('/admin');
  }, [router]);

  const user = isAuthed ? getAuthUser() : null;

  return {
    isAuthorized: isHydrated && isAuthed,
    isChecking: !isHydrated,
    user,
    logout,
  };
}
