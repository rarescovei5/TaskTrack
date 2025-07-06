import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Prettify } from '@/types';
import { Color, colors, Column } from '../types';
import { createTaskForColumn } from './tasksSlice';

/** --- Entity Adapter --- **/
export const columnsAdapter = createEntityAdapter<Column>({});

/** --- Async Thunks --- **/
export const createColumnForBoard = createAsyncThunk(
  'columns/createColumnForBoard',
  async ({ boardId }: { boardId: string }) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const randomColor: Color = colors[Math.floor(Math.random() * colors.length)];

    const column: Column = {
      id,
      name: 'New Column',
      color: randomColor,
      createdAt: now,
      boardId,
      taskIds: [],
    };

    return { column, boardId };
  }
);

/** --- Initial State --- **/
export type ColumnsState = Prettify<ReturnType<typeof columnsAdapter.getInitialState>>;
const initialState = columnsAdapter.getInitialState({
  // any extra fields can go here
});

/** --- Slice --- **/
const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addColumn: columnsAdapter.addOne,
    setColumns: columnsAdapter.setAll,
    updateColumn: columnsAdapter.updateOne,
    removeColumn: columnsAdapter.removeOne,
    addTaskToColumn: (
      state,
      action: PayloadAction<{ columnId: string; taskId: string }>
    ) => {
      state.entities[action.payload.columnId]?.taskIds.push(action.payload.taskId);
    },
    removeTaskFromColumn: (
      state,
      action: PayloadAction<{ columnId: string; taskId: string }>
    ) => {
      const col = state.entities[action.payload.columnId];
      if (col) col.taskIds = col.taskIds.filter((id) => id !== action.payload.taskId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createColumnForBoard.fulfilled, (state, action) => {
        columnsAdapter.addOne(state, action.payload.column);
      })
      .addCase(createTaskForColumn.fulfilled, (state, action) => {
        const column = state.entities[action.payload.columnId];
        column.taskIds.push(action.payload.task.id);
      });
  },
});

/** --- Actions & Reducer --- **/
export const {
  addColumn,
  setColumns,
  updateColumn,
  removeColumn,
  addTaskToColumn,
  removeTaskFromColumn,
} = columnsSlice.actions;
export default columnsSlice.reducer;

/** --- Selectors --- **/
export const {
  selectAll: selectAllColumns,
  selectById: selectColumnById,
  selectEntities: selectColumnsEntities,
  selectIds: selectColumnIds,
} = columnsAdapter.getSelectors<RootState>((state) => state.columns);

export const makeSelectColumnsByIds = (columnIds: string[]) =>
  createSelector([selectColumnsEntities], (columnsEntities) =>
    columnIds.map((columnId) => columnsEntities[columnId])
  );
