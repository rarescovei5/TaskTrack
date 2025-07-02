import React from 'react';

export enum SubscriptionPlans {
  Free,
  Pro,
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  profilePictureUrl: string;
  subscriptionPlan: SubscriptionPlans;
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
    id: '',
    email: '',
    username: '',
    profilePictureUrl: '',
    subscriptionPlan: SubscriptionPlans.Free,
  });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = React.useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
