import {
  createSlice,
  createEntityAdapter,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { Prettify } from '@/types';
import { Column, Task, TaskPriority, TaskStatus } from '../types';

/** --- Entity Adapter --- **/
export const tasksAdapter = createEntityAdapter<Task>();

/** --- Async Thunks --- **/
export const createTaskForColumn = createAsyncThunk(
  'tasks/createTaskForColumn',
  async ({ columnId }: { columnId: string }) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const task: Task = {
      id,
      title: 'New Title',
      description: null,
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

export const removeTaskFromAll = createAsyncThunk(
  'tasks/removeTaskFromAll',
  (payload: { columnId: string; taskId: string }) => {
    return payload;
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
    builder
      .addCase(createTaskForColumn.fulfilled, (state, action) => {
        tasksAdapter.addOne(state, action.payload.task);
      })
      .addCase(removeTaskFromAll.fulfilled, (state, action) => {
        tasksAdapter.removeOne(state, action.payload.taskId);
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

export const makeSelectTasksByIds = (taskIds: string[]) =>
  createSelector([selectTasksEntities], (tasksEntities): Task[] =>
    taskIds.map((boardId) => tasksEntities[boardId])
  );

export const makeSelectGroupedTasksByIds = (taskIds: string[]) =>
  createSelector([selectTasksEntities], (tasksEntities) => {
    const groupedTasks: Record<Column['id'], Task[]> = {};

    taskIds.map((taskId) => {
      const task = tasksEntities[taskId];

      if (!groupedTasks[task.columnId]) {
        groupedTasks[task.columnId] = [];
      }

      groupedTasks[task.columnId].push(task);
    });

    return groupedTasks;
  });
