import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note } from "../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";

// fetchingnote from selected folder fromleft
export default function Middle({
  isFavoritesPage = false,
  isArchivedPage = false,
  isTrashPage = false,
}) {
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
        // archived
        else if (isArchivedPage) {
          const response = await api.get(
            "/notes?archived=true&favorite=false&deleted=false&limit=100",
          );
          const archiveData = response.data.notes;
          setNotes(archiveData);
          setFolderName("Archived Notes");
          return;
        }

        // trash
        else if (isTrashPage) {
          const response = await api.get("/notes?deleted=true&limit=200");
          const trashData = response.data.notes;
          setNotes(trashData);
          setFolderName("Trash");
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
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage]);

  // to show folderName as heading in middleportion
  useEffect(() => {
    if (isArchivedPage) {
      setFolderName("Archived Notes");
      return;
    }
    if (isFavoritesPage) {
      // console.log("isFavoritesPage =", isFavoritesPage);
      setFolderName("Favorites");
      return;
    }
    if (isTrashPage) {
      setFolderName("Trash");
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
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage]);

  return (
    <div
      className="
        h-screen 
        w-middle
        p-4
        border-r border-border
        flex flex-col gap-5
        font-name
  overflow-y-auto
      "
    >
      <h2 className="text-2xl font-semibold">{folderName || "Notes"}</h2>
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-3 "
          onClick={() => {
            if (isTrashPage) {
              navigate(`/trash/note/${note.id}`);
            } else {
              navigate(`/folder/${note.folderId}/note/${note.id}`);
            }
          }}
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
