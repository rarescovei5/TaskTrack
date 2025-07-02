import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Column, Prettify } from '@/types';

/** --- Entity Adapter --- **/
export const columnsAdapter = createEntityAdapter<Column>({});

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
