import { createContext, useContext, useState } from "react";

type NotesContextType = {
  refreshTrigger: number;
  refreshNotes: () => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function refreshNotes() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <NotesContext.Provider value={{ refreshTrigger, refreshNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used inside NotesProvider");
  }

  return context;
}
