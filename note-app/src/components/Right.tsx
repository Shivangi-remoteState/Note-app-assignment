import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note } from "../types/api";
import NoteMenu from "./NoteMenu";
import { CalendarDays, Folder } from "lucide-react";
import { useParams } from "react-router-dom";

// interface RightProps {
//   noteId:string;
// }
export default function Right() {
  const { noteId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  // fetching selected note
  useEffect(() => {
    if (!noteId) {
      setNote(null);
      return;
    }
    async function loadNote() {
      try {
        const response = await api.get(`/notes/${noteId}`);
        console.log(response);
        const fullNote = response.data.note;
        setNote(fullNote);
      } catch (error) {
        console.log("error in loading notes:", error);
      }
    }
    loadNote();
  }, [noteId]);
  if (!note) {
    return (
      <div className="h-screen w-right flex items-center justify-center text-center text-white/60">
        <div>
          <p className="text-lg font-medium">Select a note to view</p>
          <p className="text-sm opacity-70">
            Choose a note from the list to see its contents.
          </p>
        </div>
      </div>
    );
  }
  // formating date
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <div
      className="
        h-screen 
        w-right
        py-10
        px-8
        text-title
        overflow-y-auto
        font-name 
      "
    >
      <div className="flex  justify-between pb-8 relative">
        <h1 className="text-3xl font-semibold">{note.title}</h1>

        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/Frame 1.svg" alt="menu icon" />
        </button>

        {menuOpen && <NoteMenu />}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-18 border-b border-white/20 pb-6">
          <div className="flex items-center gap-2">
            <span>
              <CalendarDays size={16} />
            </span>
            <span className="text-sm opacity-70">Date</span>
          </div>
          <span className="text-sm font-medium">
            {formatDate(note.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-18">
          <div className="flex items-center gap-2">
            <span>
              <Folder size={16} />
            </span>
            <span className="text-sm opacity-70">Folder</span>
          </div>
          <span className="text-sm font-medium">{note.folder.name}</span>
        </div>
      </div>

      <div className="text-sm py-8">
        <p>{note.content || "no content is available"}</p>
      </div>
    </div>
  );
}
