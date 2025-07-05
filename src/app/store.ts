import { combineReducers, configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settings/settingsSlice';

import workspacesReducer from '../features/workspace/slices/workspacesSlice';
import tasksReducer from '../features/workspace/slices/tasksSlice';
import columnsReducer from '../features/workspace/slices/columnsSlice';
import boardsReducer from '../features/workspace/slices/boardsSlice';
import authReducer from '../features/auth/slices/authSlice';
import { apiSlice } from './api/apiSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const makeLocalPersistConfig = (key: string) => ({
  key,
  storage,
});

// Wrap each slice
const persistedAuth = persistReducer(makeLocalPersistConfig('auth'), authReducer);
const persistedSettings = persistReducer(
  makeLocalPersistConfig('settings'),
  settingsReducer
);
const persistedWorkspaces = persistReducer(
  makeLocalPersistConfig('workspaces'),
  workspacesReducer
);
const persistedBoards = persistReducer(makeLocalPersistConfig('boards'), boardsReducer);
const persistedColumns = persistReducer(
  makeLocalPersistConfig('columns'),
  columnsReducer
);
const persistedTasks = persistReducer(makeLocalPersistConfig('tasks'), tasksReducer);

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: persistedAuth,
  settings: persistedSettings,

  workspaces: persistedWorkspaces,
  boards: persistedBoards,
  columns: persistedColumns,
  tasks: persistedTasks,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
