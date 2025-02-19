import { createSlice } from '@reduxjs/toolkit';
import { Workspace } from '../../types';

const loadState = (): Array<Workspace> => {
  try {
    const data = localStorage.getItem('workspaces');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing workspaces from localStorage', error);
    return [];
  }
};

const initialState: Array<Workspace> = loadState();

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    save: (state) => {
      localStorage.setItem('workspaces', JSON.stringify(state));
    },
    newWorkspace(state) {
      state.push({
        name: `Workspace ${state.length + 1}`,
        settings: {},
        boards: [],
      });
    },
  },
});

export const { save, newWorkspace } = workspacesSlice.actions;
export default workspacesSlice.reducer;
