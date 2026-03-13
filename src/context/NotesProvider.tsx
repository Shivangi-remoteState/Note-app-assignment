import { useState } from "react";
import { NotesContext } from "./NotesContext";

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
