import React from 'react';
import { AuthTokenProvider } from './AuthTokenProvider';
import { UserProvider } from './UserProvider';

interface AuthProvidersProps {
  children: React.ReactNode;
}

export const AuthProviders = ({ children }: AuthProvidersProps) => (
  <AuthTokenProvider>
    <UserProvider>{children}</UserProvider>
  </AuthTokenProvider>
);
