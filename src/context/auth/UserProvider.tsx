import React from 'react';

export interface UserInfo {
  email: string;
  fullName: string;
  profilePicture: string;
}

interface UserContextType {
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const UserContext = React.createContext<UserContextType | null>(null);
UserContext.displayName = 'UserContext';

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<UserInfo>({
    email: '',
    fullName: '',
    profilePicture: '',
  });

  const value = React.useMemo(() => ({ user, setUser }), [user, setUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
