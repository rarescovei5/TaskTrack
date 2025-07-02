import { useAuth } from '@/auth/AuthProvider';
import { axiosInstance } from '../api';
import React from 'react';

const useRefreshToken = () => {
  const { setToken } = useAuth();

  const refresh = React.useCallback(async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      setToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }, [setToken]);

  return refresh;
};

export default useRefreshToken;
