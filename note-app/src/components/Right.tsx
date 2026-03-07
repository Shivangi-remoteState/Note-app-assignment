import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import type { Note, Folder } from "../types/api";
import NoteMenu from "./NoteMenu";
import {
  CalendarDays,
  Folder as FolderIcon,
  ChevronDown,
  Loader2,
  Check,
  Circle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Restore from "./Restore";

interface RightProps {
  isNewNote?: boolean;
  isTrashMode?: boolean;
}

export default function Right({
  isNewNote = false,
  isTrashMode = false,
}: RightProps) {
  const { noteId, folderId } = useParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const createLock = useRef(false);
  const [note, setNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const [currentNoteId, setCurrentNoteId] = useState<string | null>(
    noteId || null,
  );
  const [saveStatus, setSaveStatus] = useState("Idle");

  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);

  // fetching notes
  useEffect(() => {
    // not fetch note when creating
    if (isNewNote) return;
    if (!noteId) {
      setNote(null);
      return;
    }
    async function loadNote() {
      try {
        const response = await api.get(`/notes/${noteId}`);
        // console.log(response);
        const fullNote = response.data.note;
        // console.log("note:", fullNote);
        setNote(fullNote);
        setTitle(fullNote.title || "");
        setContent(fullNote.content || "");
        setCurrentNoteId(fullNote.id);
        setIsFavorite(fullNote.isFavorite);
        setIsArchived(fullNote.isArchived);
        setSelectedFolder(fullNote.folderId);
      } catch (error) {
        console.log("error in loading notes:", error);
      }
    }
    loadNote();
  }, [noteId, isNewNote]);

  //  fetch folder
  useEffect(() => {
    async function loadFolders() {
      try {
        const response = await api.get("/folders");
        setFolders(response.data.folders);
      } catch (error) {
        console.log("Error in loading folders", error);
      }
    }

    loadFolders();
  }, []);

  useEffect(() => {
    if (isNewNote && !noteId) {
      setTitle("");
      setContent("");
      setCurrentNoteId(null);
      createLock.current = false;
      setSaveStatus("Idle");
    }
  }, [isNewNote, noteId]);

  useEffect(() => {
    if (isNewNote && folderId) {
      setSelectedFolder(folderId);
    }
  }, [folderId, isNewNote]);

  // funtion auto save
  async function autoSaveNote() {
    try {
      if (!currentNoteId && !createLock.current) {
        createLock.current = true;
        setSaveStatus("Saving");

        const response = await api.post("/notes", {
          title: title || "Untitled",
          content,
          folderId: selectedFolder,
        });

        const newId = response.data.id;
        setCurrentNoteId(newId);
        window.dispatchEvent(new Event("notesCreated"));
        navigate(`/folder/${selectedFolder}/note/${newId}`, { replace: true });
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus("Idle"), 1000);
        return;
      }

      // updating existing note
      if (currentNoteId) {
        setSaveStatus("Saving");
        window.dispatchEvent(new Event("notesUpdated"));
        await api.patch(`/notes/${currentNoteId}`, {
          title: title || "Untitled",
          content,
          updatedAt: new Date().toISOString(),
        });
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus("Idle"), 1500);
      }
    } catch (error) {
      console.log("Autosave error:", error);
    }
  }

  // autosave debouncing
  useEffect(() => {
    if (!selectedFolder) return;
    if (!title && !content) return;
    setSaveStatus("Typing");

    const timer = setTimeout(() => {
      autoSaveNote();
    }, 600);

    return () => clearTimeout(timer);
  }, [title, content]);

  // folder chsnge
  async function handleFolderChange(folderId: string) {
    setSelectedFolder(folderId);
    setFolderDropdownOpen(false);

    // if creating a new note, don't call API
    if (isNewNote) return;
    try {
      await api.patch(`/notes/${noteId}`, {
        folderId,
      });
      window.dispatchEvent(new Event("notesUpdated"));
      navigate(`/folder/${folderId}/note/${noteId}`);
    } catch (error) {
      console.log("Error updating folder:", error);
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

  //  favourite
  async function toggleFavorite() {
    try {
      const valUpdated = !isFavorite;
      await api.patch(`/notes/${noteId}`, {
        isFavorite: valUpdated,
      });
      setIsFavorite(valUpdated);
      setNote((prev) => (prev ? { ...prev, isFavorite: valUpdated } : prev));
      window.dispatchEvent(new Event("notesUpdated"));
    } catch (error) {
      console.log("Error in updating favorite:", error);
    }
  }

  // archived
  async function toggleArchived() {
    try {
      const valUpdated = !isArchived;

      await api.patch(`/notes/${noteId}`, {
        isArchived: valUpdated,
      });
      setIsArchived(valUpdated);
      setNote((prev) => (prev ? { ...prev, isArchived: valUpdated } : prev));
      window.dispatchEvent(new Event("notesUpdated"));
    } catch (err) {
      console.log("Error in updating archived: ", err);
    }
  }
  // delete
  async function handleDelete() {
    try {
      await api.delete(`/notes/${noteId}`);
      alert("Note deleted and move to trash");
      // referesh the middle.tsx
      window.dispatchEvent(new Event("notesUpdated"));
      navigate(`/trash/note/${noteId}`);
    } catch (error) {
      console.log("Error in deleting note:", error);
    }
  }

  // restore ui
  if (isTrashMode) {
    return <Restore noteTitle={note?.title || ""} noteId={noteId} />;
  }
  return (
    <div
      className="
        h-screen 
        w-right
        py-10
        px-8
        text-title
       flex
       flex-col
        font-name 
      "
    >
      <div className="flex  justify-between pb-8 ">
        {/* title */}
        <div className="flex items-center gap-2 w-full">
          <input
            className="text-3xl font-bold w-full bg-transparent outline-none"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {isFavorite && <span className="text-yellow-400">★</span>}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/Frame 1.svg" alt="menu icon" />
        </button>

        {menuOpen && (
          <NoteMenu
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isArchived={isArchived}
            toggleArchive={toggleArchived}
            handleDelete={handleDelete}
          />
        )}
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

        <div className="flex items-center gap-18 relative">
          <div className="flex items-center gap-2">
            <FolderIcon size={16} />
            <span className="text-sm opacity-70">Folder</span>
          </div>

          <div className="relative">
            <div
              onClick={() => setFolderDropdownOpen(!folderDropdownOpen)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="text-sm font-bold truncate max-w-50">
                {folders.find((f) => f.id === selectedFolder)?.name ||
                  "Loading..."}
              </span>

              <ChevronDown size={14} />
            </div>

            {folderDropdownOpen && (
              <div className="absolute top-6 left-0 w-44 bg-[#1c1c1c] border border-white/10 rounded-md shadow-lg z-50">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleFolderChange(folder.id)}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-hoverFile truncate "
                  >
                    {folder.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm py-8 ">
        <textarea
          className="w-full h-[60vh] bg-transparent border p-3 outline-none"
          placeholder="Write something here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 text-base mt-3">
        {saveStatus === "Typing" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
            <Circle size={12} />
            Typing
          </div>
        )}

        {saveStatus === "Saving" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
            <Loader2 size={12} className="animate-spin" />
            Saving...
          </div>
        )}

        {saveStatus === "Saved" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400">
            <Check size={12} />
            Saved
          </div>
        )}

        {saveStatus === "Idle" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/10 text-gray-400">
            <Circle size={10} />
            Idle
          </div>
        )}
      </div>
    </div>
  );
}
