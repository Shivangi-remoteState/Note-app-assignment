import { useEffect, useState, useRef } from "react";
import { api } from "../../api/axios";
import type { Note } from "../../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "@/context/NotesContext";
import NotesList from "./NotesList";
import useFolder from "@/hooks/useFolder";
import { useSearchParams } from "react-router-dom";
// fetchingnote from selected folder fromleft
export default function Middle({
  isFavoritesPage = false,
  isArchivedPage = false,
  isTrashPage = false,
}) {
  const requestIdRef = useRef(0);
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [notes, setNotes] = useState<Note[]>([]);
  const { refreshTrigger } = useNotes();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchResults, setSearchResults] = useState<Note[]>([]);
  async function loadNotes(pageNumber = 1) {
    const requestId = requestIdRef.current;
    try {
      setLoading(true);
      let url = `/notes?page=${pageNumber}&limit=10`;

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
      if (requestId !== requestIdRef.current) return;
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
    requestIdRef.current++;
    loadNotes(1);
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage, refreshTrigger]);
  useEffect(() => {
    setNotes([]);
  }, [folderId]);
  // scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting && hasMore && !loading) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          loadNotes(nextPage);
          return nextPage;
        });
      }
    });

    const current = loaderRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading, page, folderId]);

  // to show folderName as heading in middleportion
  const folders = useFolder();
  let folderName = "";
  if (isArchivedPage) folderName = "Archived Notes";
  else if (isFavoritesPage) folderName = "Favorites";
  else if (isTrashPage) folderName = "Trash";
  else if (folderId) {
    const selected = folders.find((f) => f.id === folderId);
    folderName = selected?.name || "";
  }

  // search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) return;

      async function searchNotes() {
        try {
          const response = await api.get(`/notes?search=${query}&limit=50`);
          setSearchResults(response.data.notes);
        } catch (error) {
          console.log("Search error:", error);
        }
      }

      searchNotes();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);
  if (query.trim() !== "") {
    return (
      <div className="h-screen flex flex-col w-middle p-4 border-r border-(--color-border) overflow-y-auto font-name bg-(--color-middle-back)">
        <h2 className="text-2xl font-semibold text-(--color-text)">
          Search Results
        </h2>

        {searchResults.length === 0 && (
          <div className="text-gray-400 pt-4">No results found</div>
        )}

        {searchResults.map((note) => (
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
    <div className="h-full w-middle p-4 border-r border-(--color-border) flex flex-col gap-5 font-name bg-(--color-middle-back) text-(--color-text) overflow-y-auto">
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
          <div className="text-gray-400 text-sm">Loading notes...</div>
        )}
      </div>
    </div>
  );
}
