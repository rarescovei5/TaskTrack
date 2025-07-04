import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { Prettify } from '@/types';
import { Workspace } from '../types';
import {
  createBoardForWorkspace,
  selectAllBoards,
  selectBoardsEntities,
} from './boardsSlice';

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
    payload: { name: string; description: string; imageUrl: string },
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
      privacy: 'private',
      boardIds: [],
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
        console.log('adding workspace', action.payload);
        workspacesAdapter.addOne(state, action.payload);
      })
      .addCase(createBoardForWorkspace.fulfilled, (state, action) => {
        const { board, workspaceId } = action.payload;
        const ws = state.entities[workspaceId];
        if (ws) {
          ws.boardIds.push(board.id);
        }
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

// Additional helper selectors:
export const selectBoardIdsByWorkspace = createSelector(
  (state: RootState, workspaceId: string) =>
    selectWorkspaceById(state, workspaceId)?.boardIds,
  (boardIds): string[] => boardIds ?? []
);
export const selectWorkspacesWithBoards = createSelector(
  selectAllWorkspaces,
  (state: RootState) => selectBoardsEntities(state),
  (workspaces, boardsMap) =>
    workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      boards: ws.boardIds
        .map((bid) => boardsMap[bid])
        .filter((b): b is NonNullable<typeof b> => !!b),
    }))
);

export const selectWorkspaceBoards = createSelector(
  [
    (state: RootState, workspaceId: string) => selectWorkspaceById(state, workspaceId),
    selectAllBoards,
  ],
  (workspace, boards) => {
    if (!workspace) return [];
    return boards.filter((board) => workspace.boardIds.includes(board.id));
  }
);
