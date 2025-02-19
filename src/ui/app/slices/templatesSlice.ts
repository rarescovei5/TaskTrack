import { createSlice } from '@reduxjs/toolkit';
import { Templates } from '../../types';

const loadState = (): Templates => {
  try {
    const data = localStorage.getItem('templates');
    return data ? JSON.parse(data) : { workspaces: [], boards: [] };
  } catch (error) {
    console.error('Error parsing templates from localStorage', error);
    return { workspaces: [], boards: [] };
  }
};

const initialState: Templates = loadState();

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    saveTemplates: (state) => {
      localStorage.setItem('templates', JSON.stringify(state));
    },
  },
});

export const { saveTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
