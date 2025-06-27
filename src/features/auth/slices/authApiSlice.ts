import { apiSlice } from '@/app/api/apiSlice';
import { Credentials, LoginResponse } from '../types';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, Credentials>({
      query: (credentials: { email: string; password: string }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
