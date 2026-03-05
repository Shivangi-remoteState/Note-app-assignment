import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Note, Folder } from "../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "./SearchContext";

// fetchingnote from selected folder fromleft
export default function Middle({
  isFavoritesPage = false,
  isArchivedPage = false,
  isTrashPage = false,
}) {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { query } = useSearch();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folderName, setFolderName] = useState("");

  async function loadNotes() {
    try {
      // favourite
      if (isFavoritesPage) {
        const response = await api.get(
          "/notes?archived=false&favorite=true&deleted=false&limit=100",
        );
        const favData = response.data.notes;
        setNotes(favData);
        return;
      }
      // archived
      else if (isArchivedPage) {
        const response = await api.get(
          "/notes?archived=true&favorite=false&deleted=false&limit=100",
        );
        const archiveData = response.data.notes;
        setNotes(archiveData);
        return;
      }

      // trash
      else if (isTrashPage) {
        const response = await api.get("/notes?deleted=true&limit=200");
        const trashData = response.data.notes;
        setNotes(trashData);
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
  // fetching notes when folder chnages
  useEffect(() => {
    loadNotes();
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage]);

  // refresh note in middle
  useEffect(() => {
    function refreshNotes() {
      loadNotes();
    }
    window.addEventListener("notesCreated", refreshNotes);
    window.addEventListener("notesUpdated", refreshNotes);

    return () => {
      window.removeEventListener("notesUpdated", refreshNotes);
      window.removeEventListener("notesCreated", refreshNotes);
    };
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

        const selectedFolder = folders.find(
          (folder: Folder) => folder.id === folderId,
        );

        setFolderName(selectedFolder?.name || "");
      } catch (error) {
        console.log("error in fetching folder :", error);
      }
    }

    loadFolderName();
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage]);

  // search
  const [allSearchNote, setAllSearchNotes] = useState<Note[]>([]);
  const [allSearchFolders, setAllSearchFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (query.trim() === "") return;

    async function loadSearchData() {
      const responseFolder = await api.get("/folders");
      setAllSearchFolders(responseFolder.data.folders);

      const responseNote = await api.get("/notes?deleted=false&limit=500");
      setAllSearchNotes(responseNote.data.notes);
    }

    loadSearchData();
  }, [query]);
  if (query.trim() !== "") {
    const q = query.toLowerCase();

    const matchingFolders = allSearchFolders.filter((f) =>
      f.name.toLowerCase().includes(q),
    );

    const matchingNotes = allSearchNote.filter((n) =>
      (n.title?.toLowerCase() || "").includes(q),
    );

    // if folder matches then  folder + notes is
    if (matchingFolders.length > 0) {
      return (
        <div className="h-screen w-middle p-4 border-r overflow-y-auto font-name">
          <h2 className="text-2xl font-semibold">Folders</h2>

          {matchingFolders.map((folder) => (
            <div key={folder.id} className="pt-5">
              <h3 className="text-xl font-semibold mb-3">{folder.name}</h3>

              {allSearchNote
                .filter((note) => note.folderId === folder.id)
                .map((note) => (
                  <div
                    key={note.id}
                    className="pb-3"
                    onClick={() =>
                      navigate(`/folder/${note.folderId}/note/${note.id}`)
                    }
                  >
                    <Card
                      title={note.title}
                      date={note.createdAt}
                      preview={note.preview}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
    }

    // Only notes match
    return (
      <div className="h-screen w-middle p-4 border-r overflow-y-auto font-name">
        <h2 className="text-2xl font-semibold">Search Results</h2>

        {matchingNotes.map((note) => (
          <div
            key={note.id}
            className="pt-4"
            onClick={() => navigate(`/folder/${note.folderId}/note/${note.id}`)}
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
