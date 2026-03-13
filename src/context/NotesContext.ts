import { createContext } from "react";

export type NotesContextType = {
  refreshTrigger: number;
  refreshNotes: () => void;
};

export const NotesContext = createContext<NotesContextType | null>(null);
