import { useEffect, useState, useRef } from "react";
import { api } from "../../api/axios";
import type { Note, Folder } from "../../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useNotes } from "@/context/NotesContext";
import NotesList from "./NotesList";

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
  const { refreshTrigger } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  // pagination

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // detect scroll
  const containerRef = useRef<HTMLDivElement>(null);
  async function loadNotes() {
    if (loading || !hasMore) return;
    setLoading(true);
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
      const response = await api.get("/notes", {
        params: {
          folderId,
          page,
          limit,
        },
      });

      const noteData = response.data.notes;

      setNotes((prev) => [...prev, ...noteData]);

      if (noteData.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error in loading notes", error);
    }
    setLoading(false);
  }
  // fetching notes when folder chnages
  useEffect(() => {
    setNotes([]);
    setPage(1);
    setHasMore(true);
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage, refreshTrigger]);
  useEffect(() => {
    loadNotes();
  }, [page, folderId]);

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
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      const bottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 20;

      if (bottom) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

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
        <div
          ref={containerRef}
          className="h-screen w-middle p-4 border-r overflow-y-auto font-name"
        >
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
              id={note.id}
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
      {/* notes List */}
      <NotesList
        notes={notes}
        isTrashPage={isTrashPage}
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
      />
      {loading && (
        <div className="text-center text-sm opacity-60">Loading notes...</div>
      )}
    </div>
  );
}
