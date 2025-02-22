import { createSlice } from '@reduxjs/toolkit';
import { Board, Templates, Workspace } from '../../types';

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
    makeWorkspaceTemplate: (state, { payload }: { payload: Workspace }) => {
      state.workspaces.push(payload);
    },
    makeBoardTemplate: (state, { payload }: { payload: Board }) => {
      state.boards.push(payload);
    },
    deleteWorksapceTemplate: (state, { payload }: { payload: number }) => {
      state.workspaces.splice(payload, 1);
    },
    deleteBoardTemplate: (state, { payload }: { payload: number }) => {
      state.boards.splice(payload, 1);
    },
  },
});

export const {
  saveTemplates,
  makeWorkspaceTemplate,
  deleteWorksapceTemplate,
  makeBoardTemplate,
  deleteBoardTemplate,
} = templatesSlice.actions;
export default templatesSlice.reducer;
