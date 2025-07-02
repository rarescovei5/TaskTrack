import React from 'react';

interface AuthContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = React.useState<string>('');

  const value = React.useMemo(() => ({ token, setToken }), [token]);
  return <AuthContext value={value}>{children}</AuthContext>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
