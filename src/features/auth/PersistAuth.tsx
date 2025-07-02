import React from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import { useAuth } from './AuthProvider';

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
        console.log('Refresh token verified successfully');
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    !token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your own loading spinner
  }

  return children;
};

export default PersistAuth;
