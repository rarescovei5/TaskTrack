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
    saveWorkspaces: (state) => {
      localStorage.setItem('workspaces', JSON.stringify(state));
    },
    newWorkspace(state) {
      state.push({
        name: `Workspace ${state.length + 1}`,
        settings: {},
        boards: [],
      });
    },
    newBoard(state, action) {
      const colors: Array<'red' | 'blue' | 'orange'> = [
        'red',
        'blue',
        'orange',
      ];
      const randomColor = Math.floor(Math.random() * 3);

      state[action.payload].boards.push({
        title: `Board ${state[action.payload].boards.length + 1}`,
        views: ['Board', 'Table'],
        cards: [],
        bgColor: colors[randomColor],
        isFavorite: false,
      });
    },
  },
});

export const { saveWorkspaces, newWorkspace, newBoard } =
  workspacesSlice.actions;
export default workspacesSlice.reducer;
