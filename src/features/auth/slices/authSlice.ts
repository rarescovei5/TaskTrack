import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../types';
import { RootState } from '@/app/store';

export interface AuthState {
  user: UserData | null;
  token: string | null;
}
const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentUserId = (state: RootState) => selectCurrentUser(state)?.id;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => {
  return state.auth.user !== null && state.auth.token !== null;
};
