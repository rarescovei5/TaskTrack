import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settings/settingsSlice';

import workspacesReducer from './workspaces/workspacesSlice';
import tasksReducer from './tasks/tasksSlice';
import columnsReducer from './columns/columnsSlice';
import boardsReducer from './boards/boardsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,

    // Entity Reducers
    workspaces: workspacesReducer,
    columns: columnsReducer,
    boards: boardsReducer,
    tasks: tasksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
