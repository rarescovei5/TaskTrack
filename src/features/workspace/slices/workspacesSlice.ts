import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { Prettify } from '@/types';
import { Board, Column, ColumnWithTasks, Task, Workspace } from '../types';
import {
  createBoardForWorkspace,
  selectAllBoards,
  selectBoardsEntities,
} from './boardsSlice';
import { selectAllTasks, selectTasksEntities } from './tasksSlice';
import { selectAllColumns, selectColumnsEntities } from './columnsSlice';

/** --- Entity Adapter --- **/
const workspacesAdapter = createEntityAdapter<Workspace>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

/** --- Initial State --- **/
export type WorkspacesState = Prettify<
  ReturnType<typeof workspacesAdapter.getInitialState>
>;
const initialState = workspacesAdapter.getInitialState({
  // any extra fields go here
});

/** --- Async Thunks --- **/
export const createWorkspace = createAsyncThunk(
  'workspaces/createWorkspace',
  async (
    payload: {
      name: Workspace['name'];
      description: Workspace['description'];
      imageUrl: Workspace['imageUrl'];
    },
    { getState }
  ) => {
    const { name, description, imageUrl } = payload;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const ownerId = (getState() as RootState).auth.user!.id;

    const newWorkspace: Workspace = {
      id,
      name,
      description,
      imageUrl,
      ownerId,
      createdAt: now,
      members: [],
      boardIds: [],
      isPublic: false,
    };

    return newWorkspace;
  }
);

/** --- Slice --- **/
const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    // CRUD on workspaces
    setWorkspaces: workspacesAdapter.setAll,
    addWorkspace: workspacesAdapter.addOne,
    updateWorkspace: workspacesAdapter.updateOne,
    removeWorkspace: workspacesAdapter.removeOne,

    // Manage boards inside a workspace
    addBoardToWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; boardId: string }>
    ) => {
      const ws = state.entities[action.payload.workspaceId];
      if (ws) {
        ws.boardIds.push(action.payload.boardId);
      }
    },
    removeBoardFromWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; boardId: string }>
    ) => {
      const ws = state.entities[action.payload.workspaceId];
      if (ws) {
        ws.boardIds = ws.boardIds.filter((id) => id !== action.payload.boardId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWorkspace.fulfilled, (state, action) => {
        workspacesAdapter.addOne(state, action.payload);
      })
      .addCase(createBoardForWorkspace.fulfilled, (state, action) => {
        const ws = state.entities[action.payload.workspaceId];
        ws.boardIds.push(action.payload.board.id);
      });
  },
});

/** --- Actions & Reducer --- **/
export const {
  addWorkspace,
  setWorkspaces,
  updateWorkspace,
  removeWorkspace,
  addBoardToWorkspace,
  removeBoardFromWorkspace,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;

/** --- Selectors --- **/
export const {
  selectAll: selectAllWorkspaces,
  selectById: selectWorkspaceById,
  selectEntities: selectWorkspacesEntities,
  selectIds: selectWorkspaceIds,
} = workspacesAdapter.getSelectors<RootState>((state) => state.workspaces);
