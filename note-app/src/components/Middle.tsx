import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note } from "../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";

export default function Middle() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [folderName, setFolderName] = useState("");

  // Load notes inside folder
  useEffect(() => {
    if (!folderId) {
      setNotes([]);
      return;
    }

    async function loadNotes() {
      try {
        const response = await api.get(`/notes?folderId=${folderId}`);
        setNotes(response.data.notes);
      } catch (error) {
        console.log("Error loading notes:", error);
      }
    }

    loadNotes();
  }, [folderId]);

  // Listen for updates when a note is edited
  useEffect(() => {
    function refreshNotes() {
      if (folderId) {
        api
          .get(`/notes?folderId=${folderId}`)
          .then((res) => setNotes(res.data.notes));
      }
    }

    window.addEventListener("notesUpdated", refreshNotes);

    return () => window.removeEventListener("notesUpdated", refreshNotes);
  }, [folderId]);

  // Load folder name for header
  useEffect(() => {
    async function loadFolderName() {
      if (!folderId) return;

      try {
        const res = await api.get("/folders");
        const current = res.data.folders.find((f: any) => f.id === folderId);
        setFolderName(current?.name || "Notes");
      } catch (error) {
        console.log("Error loading folder name:", error);
      }
    }

    loadFolderName();
  }, [folderId]);

  return (
<div className="h-screen w-middle p-4 border-r border-border flex flex-col gap-5 font-name">
      <h2 className="text-2xl font-semibold">{folderName}</h2>
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-3 cursor-pointer"
          onClick={() => navigate(`/folder/${folderId}/note/${note.id}`)}
        >
          <Card
            title={note.title}
            date={note.createdAt}
            preview={note.preview}
          />
        </div>
      ))}
    </div>
  );
}