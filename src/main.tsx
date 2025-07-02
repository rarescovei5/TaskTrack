import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './app/store';
import { AuthProviders } from './auth';
import PersistAuth from './auth/PersistAuth';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProviders>
      <PersistAuth>
        <Provider store={store}>
          <App />
        </Provider>
      </PersistAuth>
    </AuthProviders>
  </React.StrictMode>
);
