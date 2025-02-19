import { configureStore } from '@reduxjs/toolkit';
import workspacesReducer from './slices/workspacesSlice';
import templatesReducer from './slices/templatesSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    workspaces: workspacesReducer,
    templates: templatesReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
