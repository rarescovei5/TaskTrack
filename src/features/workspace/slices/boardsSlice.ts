import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Prettify } from '@/types';
import { Board, Color, colors, Column, ColumnWithTasks, Task } from '../types';
import { selectAllColumns, selectColumnsEntities } from './columnsSlice';
import { selectAllTasks, selectTasksEntities } from './tasksSlice';

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
      description: 'New Description',
      color: randomColor,
      createdAt: now,
      isStarred: false,
      columnIds: [],
    };

    return { board, workspaceId };
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
    builder.addCase(createBoardForWorkspace.fulfilled, (state, action) => {
      boardsAdapter.addOne(state, action.payload.board);
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

export const selectBoardColumns = createSelector(
  [selectAllColumns, selectBoardById],
  (columns, board): Column[] =>
    board.columnIds.map((colId) => columns.find((col) => col.id === colId)) as Column[]
);
export const selectBoardColumnsWithTasks = createSelector(
  [selectBoardColumns, selectAllTasks],
  (columns, tasks): ColumnWithTasks[] =>
    columns.map((col) => {
      const { taskIds, ...colNoTaskIds } = col;
      return {
        ...colNoTaskIds,
        tasks: taskIds.map((taskId) =>
          tasks.find((task) => task.id === taskId)
        ) as Task[],
      };
    })
);
