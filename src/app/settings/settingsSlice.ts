import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ThemeType {
  Light,
  Dark,
}

interface SettingsStateType {
  theme: ThemeType;
}
const initialState: SettingsStateType = {
  theme: ThemeType.Light,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<{ newTheme: ThemeType }>) {
      state.theme = action.payload.newTheme;
    },
  },
});

export const { setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
