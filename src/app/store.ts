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

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  settings: settingsReducer,

  // Entity Reducers
  workspaces: workspacesReducer,
  columns: columnsReducer,
  boards: boardsReducer,
  tasks: tasksReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'settings'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
