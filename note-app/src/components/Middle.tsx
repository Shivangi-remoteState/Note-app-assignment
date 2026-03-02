import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note } from "../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";

// fetchingnote from selected folder fromleft
export default function Middle({ isFavoritesPage = false }) {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folderName, setFolderName] = useState("");

  // fetching notes when folder chnages
  useEffect(() => {
    async function loadNotes() {
      try {
        // favourite
        if (isFavoritesPage) {
          const response = await api.get(
            "/notes?archived=false&favorite=true&deleted=false&limit=100",
          );
          const favData = response.data.notes;
          setNotes(favData);
          setFolderName("Favourites");
          return;
        }
        if (!folderId) {
          setNotes([]);
          return;
        }
        const response = await api.get(`/notes?folderId=${folderId}`);
        const noteData = response.data.notes;
        setNotes(noteData);
      } catch (error) {
        console.log("Error in loading notes", error);
      }
    }
    loadNotes();
  }, [folderId, isFavoritesPage]);

  // to show folderName as heading in middleportion
  useEffect(() => {
    if (isFavoritesPage) {
      console.log("isFavoritesPage =", isFavoritesPage);
      setFolderName("Favorites");
      return;
    }
    if (!folderId) {
      setFolderName("");
      return;
    }

    async function loadFolderName() {
      try {
        const response = await api.get("/folders");
        const folders = response.data.folders;

        const selectedFolder = folders.find((folder) => folder.id === folderId);

        setFolderName(selectedFolder?.name || "");
      } catch (error) {
        console.log("error in fetching folder :", error);
      }
    }

    loadFolderName();
  }, [folderId, isFavoritesPage]);

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
      <h2 className="text-2xl font-semibold">{folderName || "Notes"}</h2>
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-3"
          onClick={() => navigate(`/folder/${note.folderId}/note/${note.id}`)}
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
