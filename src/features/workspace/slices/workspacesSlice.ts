import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { Prettify } from '@/types';
import { Workspace } from '../types';
import { cascadeRemoveBoard, createBoardForWorkspace } from './boardsSlice';

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

/** --- Thunks --- **/
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

export const cascadeRemoveWorkspace = createAsyncThunk(
  'workspaces/cascadeRemoveWorkspace',
  (payload: { workspaceId: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const workspace = state.workspaces.entities[payload.workspaceId];
    if (!workspace) {
      return payload; // nothing to do
    }

    for (const boardId of workspace.boardIds) {
      dispatch(cascadeRemoveBoard({ workspaceId: payload.workspaceId, boardId }));
    }

    return payload;
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
      .addCase(cascadeRemoveWorkspace.fulfilled, (state, action) => {
        workspacesAdapter.removeOne(state, action.payload.workspaceId);
      })
      .addCase(createBoardForWorkspace.fulfilled, (state, action) => {
        const ws = state.entities[action.payload.workspaceId];
        ws.boardIds.push(action.payload.board.id);
      })
      .addCase(cascadeRemoveBoard.fulfilled, (state, action) => {
        const ws = state.entities[action.payload.workspaceId];
        ws.boardIds = ws.boardIds.filter((boardId) => boardId !== action.payload.boardId);
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
