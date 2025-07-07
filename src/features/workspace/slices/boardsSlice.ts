import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Prettify } from '@/types';
import { Board, Color, colors, Workspace } from '../types';
import { cascadeRemoveColumn, createColumnForBoard, removeColumn } from './columnsSlice';
import { removeTask } from './tasksSlice';

/** --- Entity Adapter --- **/
export const boardsAdapter = createEntityAdapter<Board>({});

/** --- Async Thunks --- **/
export const createBoardForWorkspace = createAsyncThunk(
  'boards/createBoardForWorkspace',
  ({ workspaceId }: { workspaceId: string }) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const randomColor: Color = colors[Math.floor(Math.random() * colors.length)];

    const board: Board = {
      id,
      workspaceId,
      name: 'New Name',
      description: null,
      color: randomColor,
      createdAt: now,
      isStarred: false,
      columnIds: [],
    };

    return { board, workspaceId };
  }
);

export const cascadeRemoveBoard = createAsyncThunk(
  'boards/cascadeRemoveBoard',
  (payload: { workspaceId: string; boardId: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const board = state.boards.entities[payload.boardId];
    if (!board) return payload;

    for (const columnId of board.columnIds) {
      const column = state.columns.entities[columnId];
      if (!column) continue;

      dispatch(cascadeRemoveColumn({ boardId: payload.boardId, columnId }));
    }

    return payload;
  }
);

/** --- Initial State --- **/
export type BoardsState = Prettify<ReturnType<typeof boardsAdapter.getInitialState>>;
const initialState = boardsAdapter.getInitialState({
  // any extra fields can go here
});

/** --- Slice --- **/
const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: boardsAdapter.addOne,
    setBoards: boardsAdapter.setAll,
    updateBoard: boardsAdapter.updateOne,
    removeBoard: boardsAdapter.removeOne,
    addColumnToBoard: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string }>
    ) => {
      state.entities[action.payload.boardId]?.columnIds.push(action.payload.columnId);
    },
    removeColumnFromBoard: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string }>
    ) => {
      const bd = state.entities[action.payload.boardId];
      if (bd) bd.columnIds = bd.columnIds.filter((id) => id !== action.payload.columnId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBoardForWorkspace.fulfilled, (state, action) => {
        boardsAdapter.addOne(state, action.payload.board);
      })
      .addCase(createColumnForBoard.fulfilled, (state, action) => {
        const board = state.entities[action.payload.boardId];
        board.columnIds.push(action.payload.column.id);
      })
      .addCase(cascadeRemoveBoard.fulfilled, (state, action) => {
        boardsAdapter.removeOne(state, action.payload.boardId);
      })
      .addCase(cascadeRemoveColumn.fulfilled, (state, action) => {
        const board = state.entities[action.payload.boardId];

        board.columnIds = board.columnIds.filter(
          (columnId) => columnId !== action.payload.columnId
        );
      });
  },
});

/** --- Actions & Reducer --- **/
export const {
  addBoard,
  setBoards,
  updateBoard,
  removeBoard,
  addColumnToBoard,
  removeColumnFromBoard,
} = boardsSlice.actions;
export default boardsSlice.reducer;

/** --- Selectors --- **/
export const {
  selectAll: selectAllBoards,
  selectById: selectBoardById,
  selectEntities: selectBoardsEntities,
  selectIds: selectBoardIds,
} = boardsAdapter.getSelectors<RootState>((state) => state.boards);

/**
 * Creates a memoized selector that returns an array of boards based on their IDs.
 *
 * @param boardIds - An array of board IDs to select.
 * @returns A selector that returns the corresponding `Board[]` from the normalized board entities.
 *
 * Example:
 * const selectBoards = makeSelectBoardsByIds(boardIds);
 * const boards = useAppSelector(selectBoards);
 */
export const makeSelectBoardsByIds = (boardIds: string[]) =>
  createSelector([selectBoardsEntities], (boardsEntities): Board[] =>
    boardIds.map((boardId) => boardsEntities[boardId]).filter(Boolean)
  );

/**
 * Creates a memoized selector that groups selected boards by their `workspaceId`.
 *
 * @param boardIds - An array of board IDs to select and group.
 * @returns A selector that returns a `Record<string, Board[]>`, where each key is a `workspaceId`
 *          and its value is an array of boards that belong to that workspace.
 *
 * Example:
 * const selectGroupedBoards = makeSelectGroupedBoardsByIds(boardIds);
 * const grouped = useAppSelector(selectGroupedBoards);
 *
 */
export const makeSelectGroupedBoardsByIds = (boardIds: string[]) =>
  createSelector(
    [selectBoardsEntities],
    (boardEntities): Record<Workspace['id'], Board[]> => {
      const groupedBoards: Record<string, Board[]> = {};

      boardIds.forEach((boardId) => {
        const board = boardEntities[boardId];
        if (!board) return;

        if (!groupedBoards[board.workspaceId]) {
          groupedBoards[board.workspaceId] = [];
        }

        groupedBoards[board.workspaceId].push(board);
      });

      return groupedBoards;
    }
  );

/**
 * Groups all boards by their associated workspace.
 *
 * @returns An object where each key is a `workspaceId` and its value is an array of `Board`s belonging to that workspace.
 *
 */
export const selectGroupedBoards = createSelector([selectAllBoards], (boards) => {
  const groupedBoards: Record<Workspace['id'], Board[]> = {};

  boards.forEach((board) => {
    if (!board) return;

    if (!groupedBoards[board.workspaceId]) {
      groupedBoards[board.workspaceId] = [];
    }

    groupedBoards[board.workspaceId].push(board);
  });

  return groupedBoards;
});
