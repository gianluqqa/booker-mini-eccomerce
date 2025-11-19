"use client";

import { AuthProvider as AuthProviderComponent } from '@/contexts/AuthContext';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}

