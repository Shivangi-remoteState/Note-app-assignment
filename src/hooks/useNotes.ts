import { useContext } from "react";
import { NotesContext } from "@/context/NotesContext";

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used inside NotesProvider");
  }

  return context;
}
