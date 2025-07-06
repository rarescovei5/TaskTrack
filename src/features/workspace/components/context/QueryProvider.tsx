import React from 'react';
import { Outlet } from 'react-router-dom';

interface QueryCtx {
  query: string;
  setQuery: (q: string) => void;
}

export const QueryContext = React.createContext<QueryCtx | null>(null);

export const QueryProvider = () => {
  const [query, setQuery] = React.useState('');
  return (
    <QueryContext value={{ query, setQuery }}>
      <Outlet />
    </QueryContext>
  );
};

export const useQuery = () => {
  const ctx = React.useContext(QueryContext);
  if (!ctx) {
    throw Error('`useQuery` must be used inside a QueryProvider');
  }
  return ctx;
};
