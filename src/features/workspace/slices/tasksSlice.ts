import {
  createSlice,
  createEntityAdapter,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Prettify } from '@/types';
import { Task, TaskPriority, TaskStatus } from '../types';
import { selectCurrentUserId } from '@/features/auth/slices/authSlice';

/** --- Entity Adapter --- **/
export const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});
/** --- Async Thunks --- **/
export const createTaskForColumn = createAsyncThunk(
  'tasks/createTaskForColumn',
  async ({ columnId }: { columnId: string }) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const task: Task = {
      id,
      title: 'New Title',
      description: 'New Description',
      dueDate: null,
      columnId,
      status: TaskStatus.NotStarted,
      priority: TaskPriority.Low,
      tags: [],
      comments: [],
      assignees: [],
      createdAt: now,
    };
    return { task, columnId };
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(createTaskForColumn.fulfilled, (state, action) => {
      tasksAdapter.addOne(state, action.payload.task);
    });
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

export const selectAssignedTasks = createSelector(
  [selectAllTasks, selectCurrentUserId],
  (tasks, userId) => {
    if (!userId) return [];
    return tasks.filter((task) =>
      task.assignees.some((member) => member.userId === userId)
    );
  }
);
