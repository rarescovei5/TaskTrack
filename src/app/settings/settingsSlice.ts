import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsStateType {
  theme: 'light' | 'dark';
}
const initialState: SettingsStateType = {
  theme: 'light',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<{ newTheme: SettingsStateType['theme'] }>) {
      state.theme = action.payload.newTheme;
    },
  },
});

export const { setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
