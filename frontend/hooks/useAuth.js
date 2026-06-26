'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { clearAuth, getStoredUser, isLoggedIn } from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback(() => {
    setUser(isLoggedIn() ? getStoredUser() : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    syncUser();

    const onAuthChange = () => syncUser();
    window.addEventListener('identiqo-auth-change', onAuthChange);
    return () => window.removeEventListener('identiqo-auth-change', onAuthChange);
  }, [syncUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear local session even if blacklist request fails
    } finally {
      clearAuth();
      setUser(null);
      router.push('/signin');
    }
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    logout,
    refreshUser: syncUser,
  };
}
