import { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  query: "",
  setQuery: (_q: string) => {},
});

export function SearchProvider({ children }: any) {
  const [query, setQuery] = useState("");

  return (
    // providing data to home.tsx(childer)
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
// custom hook
export function useSearch() {
  return useContext(SearchContext);
}
