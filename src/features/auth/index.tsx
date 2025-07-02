import React from 'react';
import { AuthProvider } from './AuthProvider';
import { UserProvider } from './UserProvider';

interface AuthProvidersProps {
  children: React.ReactNode;
}

export const AuthProviders = ({ children }: AuthProvidersProps) => (
  <AuthProvider>
    <UserProvider>{children}</UserProvider>
  </AuthProvider>
);
