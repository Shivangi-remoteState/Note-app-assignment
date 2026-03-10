import { useEffect, useState, useRef } from "react";
import { api } from "../../api/axios";
import type { Note, Folder } from "../../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useNotes } from "@/context/NotesContext";
import NotesList from "./NotesList";
import useFolder from "@/hooks/useFolder";
// import { useTheme } from "@/context/ThemeContext";

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
  const { refreshTrigger } = useNotes();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadNotes(pageNumber = 1) {
    try {
      setLoading(true);
      let url = `/notes?page=${pageNumber}&limit=10`;
      // if folder note
      if (folderId) {
        url += `&folderId=${folderId}`;
      }
      if (isFavoritesPage) {
        url += `&favorite=true&deleted=false&archived=false`;
      }

      if (isArchivedPage) {
        url += `&archived=true`;
      }

      if (isTrashPage) {
        url += `&deleted=true`;
      }

      const response = await api.get(url);
      const noteData = response.data.notes;
      if (pageNumber === 1) {
        setNotes(noteData);
      } else {
        setNotes((prev) => [...prev, ...noteData]);
      }
      if (noteData.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error in loading notes", error);
    } finally {
      setLoading(false);
    }
  }
  // fetching notes when folder chnages
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadNotes(1);
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage, refreshTrigger]);

  // scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting && hasMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadNotes(nextPage);
      }
    });

    const current = loaderRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  // to show folderName as heading in middleportion
  const folders = useFolder();
  let folderName = "Notes";
  if (isArchivedPage) folderName = "Archived Notes";
  else if (isFavoritesPage) folderName = "Favorites";
  else if (isTrashPage) folderName = "Trash";
  else if (folderId) {
    const selected = folders.find((f) => f.id === folderId);
    folderName = selected?.name || "Notes";
  }

  // search
  const [allSearchNote, setAllSearchNotes] = useState<Note[]>([]);
  const [allSearchFolders, setAllSearchFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (query.trim() === "") return;

    async function loadSearchData() {
      setAllSearchFolders(folders);

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
        <div className="h-screen w-middle p-4 border-r border-[var(--color-border)] overflow-y-auto font-name bg-[var(--color-middle-back)] text-[var(--color-text)]">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">
            Folders
          </h2>
          {matchingFolders.map((folder) => (
            <div key={folder.id} className="pt-5">
              <h3 className="text-xl font-semibold pb-3 text-[var(--color-text)]">
                {folder.name}
              </h3>

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
                    <Card note={note} isActive={false} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
    }

    // Only notes match
    return (
      <div className="h-screen w-middle p-4 border-r border-[var(--color-border)] overflow-y-auto font-name bg-[var(--color-middle-back)] text-[var(--color-text)]">
        <h2 className="text-2xl font-semibold">Search Results</h2>
        {matchingNotes.map((note) => (
          <div
            key={note.id}
            className="pt-4 cursor-pointer"
            onClick={() => navigate(`/folder/${note.folderId}/note/${note.id}`)}
          >
            <Card note={note} isActive={false} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full w-middle p-4 border-r border-[var(--color-border)] flex flex-col gap-5 font-name bg-[var(--color-middle-back)] text-[var(--color-text)] overflow-y-auto">
      <h2 className="text-2xl font-semibold">{folderName}</h2>
      {/* notes List */}
      <NotesList
        notes={notes}
        isTrashPage={isTrashPage}
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
      />
      <div ref={loaderRef} className="flex justify-center py-4">
        {loading && (
          <div className="text-[var(--color-gray-400)] text-sm">
            Loading notes...
          </div>
        )}
      </div>
    </div>
  );
}
