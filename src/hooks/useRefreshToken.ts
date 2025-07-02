import { useAuth } from '../features/auth/AuthProvider';
import { axiosInstance } from '../api';
import React from 'react';
import { UserInfo, useUser } from '@/features/auth/UserProvider';

const useRefreshToken = () => {
  const { setToken } = useAuth();
  const { setUser } = useUser();

  const refresh = React.useCallback(async () => {
    try {
      const response = await axiosInstance.post<{ accessToken: string; user: UserInfo }>(
        '/auth/refresh'
      );
      setToken(response.data.accessToken);
      setUser(response.data.user);

      return response.data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return error;
    }
  }, [setToken]);

  return refresh;
};

export default useRefreshToken;
