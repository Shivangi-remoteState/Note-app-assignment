import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note } from "../types/api";
import Card from "./Card";

interface Middleprops {
  folderId: string;
  onSelectNote: (id: string) => void;
}
// fetchingnote from selected folder fromleft
export default function Middle({ folderId, onSelectNote }: Middleprops) {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    console.log("Selected folderId", folderId);
    if (!folderId) {
      setNotes([]);
      return;
    }
    async function loadNotes() {
      try {
        const response = await api.get(`/notes?folderId=${folderId}`);
        const noteData = response.data.notes;
        setNotes(noteData);
      } catch (error) {
        console.log("Error in loading notes", error);
      }
    }
    loadNotes();
  }, [folderId]);

  return (
    <div
      className="
        h-screen 
        w-middle
        p-4
        border-r border-border
        flex flex-col gap-5
        font-name
  
      "
    >
      <h2 className="text-2xl font-semibold">Personal</h2>
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-3"
          onClick={() => onSelectNote(note.id)}
        >
          <Card
            title={note.title}
            date={note.createdAt}
            preview={note.preview}
          />
        </div>
      ))}

      {/* <div className="flex flex-col gap-3">
        <Card
          title="June Reflections"
          date="5 July 2024"
          preview="A reflective look at what happened during June..."
        />
        <Card
          title="Shopping List"
          date="1 July 2024"
          preview="Eggs, Bread, Milk, Coffee and some extra snacks..."
        />
       
      </div> */}
    </div>
  );
}
