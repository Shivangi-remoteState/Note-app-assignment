import { api } from "@/api/axios";
import { useEffect, useState } from "react";
import type { Note, NoteResponse } from "../types/api";

const useNote = (noteId?: string, isNewNote?: boolean) => {
  const [note, setNote] = useState<Note | null>(null);

  // fetch note
  useEffect(() => {
    // not fetch note when creating
    if (isNewNote) return;
    if (!noteId) {
      setNote(null);
      return;
    }
    async function loadNote() {
      try {
        const response = await api.get<NoteResponse>(`/notes/${noteId}`);
        setNote(response.data.note);
        // console.log("note id:", noteId);
      } catch (error) {
        console.log("error loading note:", error);
      }
    }
    loadNote();
  }, [noteId, isNewNote]);
  return { note, setNote };
};

export default useNote;
