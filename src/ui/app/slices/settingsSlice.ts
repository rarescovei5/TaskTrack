import { createSlice } from '@reduxjs/toolkit';
import { AppSettings } from '../../types';

const defaultSettings: AppSettings = {
  theme: 'dark',
  isCollapsed: false,
};

const loadState = (): AppSettings => {
  try {
    const data = localStorage.getItem('settings');
    return data ? JSON.parse(data) : defaultSettings;
  } catch (error) {
    console.error('Error parsing settings from localStorage', error);
    return defaultSettings;
  }
};

const initialState: AppSettings = loadState();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    saveSettings: (state) => {
      localStorage.setItem('settings', JSON.stringify(state));
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    toggleIsCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

export const { saveSettings, toggleTheme, toggleIsCollapsed } =
  settingsSlice.actions;
export default settingsSlice.reducer;
