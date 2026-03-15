import { useEffect, useState, useRef } from "react";
import { api } from "../../api/axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Restore from "./Restore";
import StatusIndication from "./StatusIndication";
import NoteHeader from "./NoteHeader";
import FolderSelector from "./FolderSelector";
import NoteDate from "./NoteDate";
import NoteContent from "./NoteContent";
import useNote from "@/hooks/useNote";
import useFolder from "@/hooks/useFolder";
import { useAutoSave } from "@/hooks/useAutoSave";
import ConfirmDelete from "../ConfirmDelete";
import { toast } from "sonner";
import type { Note } from "../../types/api";
import { useNotes } from "@/hooks/useNotes";

export type CreateNoteResponse = Pick<Note, "id">;
interface RightProps {
  isNewNote?: boolean;
  isTrashMode?: boolean;
}

export default function Right({
  isNewNote = false,
  isTrashMode = false,
}: RightProps) {
  const { noteId, folderId } = useParams();
  const { note, setNote } = useNote(noteId, isNewNote);
  const { folders } = useFolder();
  const [selectedFolder, setSelectedFolder] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const createLock = useRef(false);
  const initialLoad = useRef(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const [currentNoteId, setCurrentNoteId] = useState<string | null>(
    noteId || null,
  );
  const [saveStatus, setSaveStatus] = useState("Idle");

  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const { refreshNotes } = useNotes();

  const location = useLocation();

  // initalize  notes
  useEffect(() => {
    if (!note) return;
    setTitle(note.title || "");
    setContent(note.content || "");
    setCurrentNoteId(note.id);
    setIsFavorite(note.isFavorite);
    setIsArchived(note.isArchived);
    setSelectedFolder(note.folderId);
    initialLoad.current = true;
    setSaveStatus("Idle");
  }, [note]);

  //  reseting note when click +icon
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

        const response = await api.post<CreateNoteResponse>("/notes", {
          title: title || "Untitled",
          content,
          folderId: selectedFolder,
        });

        const newId = response.data.id;
        toast.success("Note created");
        console.log("Newly create noteid", newId);
        setCurrentNoteId(newId);
        refreshNotes();
        navigate(`/folder/${selectedFolder}/note/${newId}`, { replace: true });
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus("Idle"), 1000);
        return;
      }

      // updating existing note
      if (currentNoteId) {
        setSaveStatus("Saving");

        await api.patch(`/notes/${currentNoteId}`, {
          title: title || "Untitled",
          content,
          updatedAt: new Date().toISOString(),
        });
        refreshNotes();
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus("Idle"), 1500);
      }
    } catch (error) {
      console.log("Autosave error:", error);
    }
  }

  // autosave debouncing
  useAutoSave(
    title,
    content,
    selectedFolder,
    autoSaveNote,
    setSaveStatus,
    initialLoad,
  );

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
      toast.success("Folder updated");
      navigate(`/folder/${folderId}/note/${noteId}`);
    } catch (error) {
      console.log("Error updating folder:", error);
    }
  }

  //  favourite
  async function toggleFavorite() {
    try {
      const valUpdated = !isFavorite;
      await api.patch(`/notes/${noteId}`, {
        isFavorite: valUpdated,
      });
      toast.success(
        valUpdated ? "Added to favorites" : "Removed from favorites",
      );
      setIsFavorite(valUpdated);
      setNote((prev) => (prev ? { ...prev, isFavorite: valUpdated } : prev));
      refreshNotes();
    } catch (error) {
      console.log("Error in updating favorite:", error);
    }
  }

  // archived
  async function toggleArchived() {
    try {
      if (!currentNoteId) return;
      const valUpdated = !isArchived;

      await api.patch(`/notes/${noteId}`, {
        isArchived: valUpdated,
      });
      toast.success(valUpdated ? "Note archived" : "Removed from archive");
      setIsArchived(valUpdated);
      setNote((prev) => (prev ? { ...prev, isArchived: valUpdated } : prev));
      refreshNotes();
      // if archived from a folder then show EmptyNote
      if (valUpdated) {
        // archive from folder then close editor
        if (folderId) {
          navigate(`/folder/${folderId}`);
        }
      } else {
        // Unarchive from archived page → close editor
        navigate(`/archived`);
      }
    } catch (err) {
      console.log("Error in updating archived: ", err);
    }
  }
  // delete
  async function handleDelete() {
    try {
      await api.delete(`/notes/${noteId}`);
      toast.success("Note moved to trash");
      refreshNotes();
      setNote((prev) =>
        prev
          ? { ...prev, deleted: true, deletedAt: new Date().toISOString() }
          : prev,
      );
    } catch (error) {
      console.log("Error in deleting note:", error);
    }
  }

  // restore ui
  if (isTrashMode || note?.deleted) {
    return (
      <Restore
        noteTitle={note?.title || ""}
        noteId={noteId || ""}
        folderId={note?.folderId || folderId || ""}
        currentPath={location.pathname}
        onRestore={() =>
          setNote((prev) =>
            prev ? { ...prev, deleted: false, deletedAt: null } : prev,
          )
        }
      />
    );
  }
  return (
    <div className="h-screen w-right py-10 px-8 text-title flex flex-col bg-(--color-right) text-(--color-text) font-name">
      {/* note heder */}
      <NoteHeader
        title={title}
        setTitle={setTitle}
        isFavorite={isFavorite}
        isArchived={isArchived}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        toggleFavorite={toggleFavorite}
        toggleArchived={toggleArchived}
        handleDelete={() => setNoteToDelete(noteId || null)}
      />
      <div className="flex flex-col gap-4">
        {/* note date + folder name  */}
        <NoteDate isNewNote={isNewNote} createdAt={note?.createdAt} />
        {/* folder switch */}
        <FolderSelector
          folders={folders}
          selectedFolder={selectedFolder}
          folderDropdownOpen={folderDropdownOpen}
          setFolderDropdownOpen={setFolderDropdownOpen}
          handleFolderChange={handleFolderChange}
        />
      </div>
      {/* notecontent */}
      <NoteContent content={content} setContent={setContent} />
      {/* status */}
      <StatusIndication status={saveStatus} />
      {noteToDelete && (
        <ConfirmDelete
          title="Delete Note"
          message="Are you sure you want to delete this note?"
          onCancel={() => setNoteToDelete(null)}
          onConfirm={async () => {
            await handleDelete();
            setNoteToDelete(null);
          }}
        />
      )}
    </div>
  );
}
