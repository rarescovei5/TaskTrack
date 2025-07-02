import { logOut, setCredentials } from '@/features/auth/slices/authSlice';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { RefreshResponse } from '@/features/auth/types';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log('sending refresh token');
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    console.log(refreshResult);
    if (refreshResult?.data) {
      const user = (api.getState() as RootState).auth.user!;
      // store the new token
      api.dispatch(
        setCredentials({
          user,
          accessToken: (refreshResult.data as RefreshResponse).accessToken,
        })
      );

      // retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (_builder) => ({}),
});
