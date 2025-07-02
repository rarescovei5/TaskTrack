import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Prettify, Workspace } from '@/types';

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

/** --- Slice --- **/
const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    // CRUD on workspaces
    workspacesReceived: workspacesAdapter.setAll,
    workspaceAdded: workspacesAdapter.addOne,
    workspaceUpdated: workspacesAdapter.updateOne,
    workspaceRemoved: workspacesAdapter.removeOne,

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
  // You can add extraReducers here for thunks or init-sync
});

/** --- Actions & Reducer --- **/
export const {
  workspaceAdded,
  workspacesReceived,
  workspaceUpdated,
  workspaceRemoved,
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
export const selectBoardIdsByWorkspace = (
  state: RootState,
  workspaceId: string
): string[] | undefined => {
  const ws = selectWorkspaceById(state, workspaceId);
  return ws?.boardIds;
};
