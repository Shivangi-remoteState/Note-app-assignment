import { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  query: "",
  setQuery: (q: string) => {},
});

export function SearchProvider({ children }: any) {
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
