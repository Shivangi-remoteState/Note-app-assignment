import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note } from "../types/api";
import NoteMenu from "./NoteMenu";
import { CalendarDays, Folder } from "lucide-react";
import { useParams,useNavigate } from "react-router-dom";

interface RightProps {
  isNewNote?:boolean;
}

export default function Right({isNewNote =false}:RightProps) {
  const { noteId , folderId} = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("Untitled Note");
  const [content, setContent] = useState("Start writing...");

  const [editTitle, setEditTitle] = useState(isNewNote);
  const [editContent, setEditContent] = useState(isNewNote);
  useEffect(() => {
    // not fetch note when creating
    if(isNewNote) return;
    if (!noteId) {
      setNote(null);
      return;
    }
    async function loadNote() {
      try {
        const response = await api.get(`/notes/${noteId}`);
        // console.log(response);
        const fullNote = response.data.note;
        setNote(fullNote);
        setTitle(fullNote.title);
        setContent(fullNote.content || "")
      } catch (error) {
        console.log("error in loading notes:", error);
      }
    }
    loadNote();
  }, [noteId , isNewNote]);
  // save note
    async function handleSaveNewNote() {
    try {
      const res = await api.post("/notes", {
        title,
        content,
        folderId, // auto-selected folder
      });

      const newNoteId = res.data.note.id;

      navigate(`/folder/${folderId}/note/${newNoteId}`);
    } catch (error) {
      console.log("Error in creating note:", error);
    }
  }
  // save updating note
  async function handleSaveExistingNote() {
    try {
      await api.patch(`/notes/${noteId}`, {
        title,
        content,
         updatedAt: new Date().toISOString(),    
      });

      alert("Note updated!");
      // refresh middle when note is update
      window.dispatchEvent(new Event("notesUpdated"));
    } catch (error) {
      console.log("Error in updating note:", error);
    }
  }
  // formating date
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  if (!note && !isNewNote) {
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
         {/* TITLE */}
      {editTitle ? (
        <input
          className="text-3xl font-bold bg-transparent border-b outline-none"
          value={title}
          autoFocus
          onBlur={() => setEditTitle(false)}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <h1
          className="text-3xl font-semibold cursor-pointer"
          onDoubleClick={() => setEditTitle(true)}
        >
          {title}
        </h1>
      )}

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
             <span className="font-medium">
          {isNewNote
            ? new Date().toDateString()
            : note
            ? formatDate(note.createdAt)
            : ""}
        </span>
          </span>
        </div>

        <div className="flex items-center gap-18">
          <div className="flex items-center gap-2">
            <span>
              <Folder size={16} />
            </span>
            <span className="text-sm opacity-70">Folder</span>
          </div>
          <span className="text-sm font-medium">{note?.folder?.name || "Selected Folder"}</span>
        </div>
      </div>

      <div className="text-sm py-8">
         {editContent ? (
          <textarea
            className="w-full h-[70vh] bg-transparent border p-3"
            value={content}
            autoFocus
            onBlur={() => setEditContent(false)}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <p
            className="text-sm cursor-pointer"
            onDoubleClick={() => setEditContent(true)}
          >
            {content}
          </p>
        )}
      </div>
      {/* SAVE BUTTONS */}
      {isNewNote ? (
        <button
          onClick={handleSaveNewNote}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Note
        </button>
      ) : (
        <button
          onClick={handleSaveExistingNote}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Changes
        </button>
      )}
    </div>
  );
}
