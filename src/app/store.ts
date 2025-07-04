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

// Split reducers into logical groups
const localReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const remoteReducer = combineReducers({
  workspaces: workspacesReducer,
  columns: columnsReducer,
  boards: boardsReducer,
  tasks: tasksReducer,
});

// Persist configurations
const persistConfigLocal = {
  key: 'local',
  storage,
  whitelist: ['auth', 'settings'], // Persist only local reducers here
};

const persistConfigRemote = {
  key: 'remote',
  storage,
  whitelist: ['workspaces', 'columns', 'boards', 'tasks'], // If using a custom storage later
};

// Persisted reducers
const persistedLocalReducer = persistReducer(persistConfigLocal, localReducer);
const persistedRemoteReducer = persistReducer(persistConfigRemote, remoteReducer);

const rootReducer = (state: any, action: any) => {
  const localState = persistedLocalReducer(state, action);
  const remoteState = persistedRemoteReducer(state, action);
  // each of these returns an object like { auth, settings, api } or { workspaces, columns, … }
  return {
    ...localState,
    ...remoteState,
  };
};

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
