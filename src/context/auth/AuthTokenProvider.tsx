import React from 'react';

interface AuthTokenContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const AuthTokenContext = React.createContext<AuthTokenContextType | undefined>(undefined);
AuthTokenContext.displayName = 'AuthTokenContext';

interface AuthTokenProviderProps {
  children: React.ReactNode;
}

export const AuthTokenProvider = ({ children }: AuthTokenProviderProps) => {
  const [token, setToken] = React.useState<string>('');

  const value = React.useMemo(() => ({ token, setToken }), [token, setToken]);
  return <AuthTokenContext value={value}>{children}</AuthTokenContext>;
};

export const useAuthToken = (): AuthTokenContextType => {
  const context = React.useContext(AuthTokenContext);
  if (!context) {
    throw new Error('useAuthToken must be used within an AuthTokenProvider');
  }
  return context;
};
