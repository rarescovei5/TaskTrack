import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Prettify } from '@/types';
import { Board } from '../types';

/** --- Entity Adapter --- **/
export const boardsAdapter = createEntityAdapter<Board>({});

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
