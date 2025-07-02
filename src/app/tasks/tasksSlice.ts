import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Prettify, Task } from '@/types';

/** --- Entity Adapter --- **/
export const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

/** --- Initial State --- **/
export type TasksState = Prettify<ReturnType<typeof tasksAdapter.getInitialState>>;
const initialState = tasksAdapter.getInitialState({
  // any extra fields can go here
});

/** --- Slice --- **/
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: tasksAdapter.addOne,
    setTasks: tasksAdapter.setAll,
    updateTask: tasksAdapter.updateOne,
    removeTask: tasksAdapter.removeOne,
  },
});

/** --- Actions & Reducer --- **/
export const { addTask, setTasks, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;

/** --- Selectors --- **/
export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectEntities: selectTasksEntities,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors<RootState>((state) => state.tasks);
