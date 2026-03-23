'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  updatePassword, reauthenticateWithCredential, EmailAuthProvider,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/lib/api';
import type { Admin, AuthContextType } from '@/types';

const DEFAULT_CONTEXT: AuthContextType = {
  admin:           null,
  loading:         true,
  isAuthenticated: false,
  login:           async () => {},
  logout:          async () => {},
  changePassword:  async () => {},
};

const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT);

export const useAuth = (): AuthContextType => useContext(AuthContext);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const persistToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('adminToken', token);
  else        localStorage.removeItem('adminToken');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin,   setAdmin]   = useState<Admin | null>(null);
  const [fbUser,  setFbUser]  = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
          await signOut(auth);
          setAdmin(null); setFbUser(null); persistToken(null);
          setLoading(false); return;
        }
        setFbUser(user);
        try {
          const idToken = await user.getIdToken();
          const res     = await api.post<{ token: string; admin: Admin }>('/api/auth/firebase-login', { idToken });
          persistToken(res.data.token);
          setAdmin(res.data.admin);
        } catch {
          setAdmin({ name: user.displayName ?? 'Admin', email: user.email ?? '', role: 'admin' });
        }
      } else {
        setFbUser(null); setAdmin(null); persistToken(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (ADMIN_EMAIL && email !== ADMIN_EMAIL) throw new Error('Access denied.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setAdmin(null); setFbUser(null); persistToken(null);
  };

  const changePassword = async (current: string, next: string): Promise<void> => {
    if (!fbUser?.email) throw new Error('Not authenticated');
    const cred = EmailAuthProvider.credential(fbUser.email, current);
    await reauthenticateWithCredential(fbUser, cred);
    await updatePassword(fbUser, next);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, isAuthenticated: !!admin, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}
