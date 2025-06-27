import { convertToFuzzyRegex } from "@/lib/convertToFuzzyRegex";
import React from "react";
import { Outlet } from "react-router-dom";

interface QueryCtx {
  query: string;
  rgx: RegExp;
  setQuery: (q: string) => void;
}

export const QueryContext = React.createContext<QueryCtx | null>(null);

export const QueryProvider = () => {
  const [query, setQuery] = React.useState("");
  const rgx = React.useMemo(() => convertToFuzzyRegex(query), [query]);

  const value = React.useMemo(() => ({ query, rgx, setQuery }), [query, rgx]);
  return (
    <QueryContext value={value}>
      <Outlet />
    </QueryContext>
  );
};

export const useQueryCtx = () => {
  const ctx = React.useContext(QueryContext);
  if (!ctx) {
    throw Error("`useQuery` must be used inside a QueryProvider");
  }
  return ctx;
};
