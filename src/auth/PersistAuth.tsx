import React from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import { useAuth } from './AuthProvider';

interface PersistAuthContextType {
  isLoading: boolean;
}
const PersistAuthContext = React.createContext<PersistAuthContextType | null>(null);

interface PersistAuthProps {
  children?: React.ReactNode;
}

const PersistAuth = ({ children }: PersistAuthProps) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const refresh = useRefreshToken();
  const { token } = useAuth();

  React.useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    !token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  const value = React.useMemo(() => ({ isLoading }), [isLoading]);
  return <PersistAuthContext value={value}>{children}</PersistAuthContext>;
};

export const useIsAuthLoading = () => React.useContext(PersistAuthContext);
export default PersistAuth;
